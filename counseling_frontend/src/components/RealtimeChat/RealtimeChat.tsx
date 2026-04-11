// import React from 'react'
import { useState, useEffect } from "react"; 
import axios from "axios";
import ChatsSidebar from "./ChatsSidebar";
import { socket } from "../../Socket/Socket";
import "../../CSS/realtimechat.css";

interface Chat {
    _id: string;
    name: string;
    profilePicture: string;
    field: string;
    participants?: { _id: string; name: string }[];
}

interface Message {
    id: string;
    text: string;
    type: 'sent' | 'received';
    senderId: string;
    // ── ADDED: timestamp field to store when message was sent ──
    timestamp?: string;
}

interface IncomingMessage {
    message: string;
    senderId: string;
    sender?: string;
}

// ── ADDED: interface for each notification object ──
interface Notification {
    id: string;
    text: string;
    senderName: string;
    timestamp: string;
    conversationId: string;
    isRead: boolean;
}

function RealtimeChat() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");

    // ── state to track which message is hovered to show delete button ──
    const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

    // ── state to store all notifications ──
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // ── state to toggle notification panel open or closed ──
    const [showNotifications, setShowNotifications] = useState<boolean>(false);

    // ── computed count of unread notifications for the badge ──
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const accessToken = localStorage.getItem("accessToken");
    const YOUR_USER_ID = localStorage.getItem("userId") || "";
    const YOUR_ROLE = localStorage.getItem("role") || "";

    // ── helper function to format ISO timestamp into readable HH:MM time ──
    const formatTime = (timestamp?: string): string => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // -----------------------------
    // Fetch chat list & auto-join
    // -----------------------------
    useEffect(() => {
        const fetchChats = async () => {
            if (!accessToken || !YOUR_USER_ID || !YOUR_ROLE) return;

            try {
                // -----------------------------
                // 1. Call auto-join endpoint first
                // -----------------------------
                const autoJoinResponse = await axios.post(
                    "http://localhost:3000/api/chat/auto-join",
                    {},
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                const allChats = autoJoinResponse.data.data.map((chat: any): Chat => ({
                    _id: chat._id,
                    name: chat.name,
                    profilePicture: chat.profilePicture || "",
                    field: chat.field || "",
                    participants: chat.participants || [],
                }));
                setChats(allChats); // FIXED: use auto-joined chat list
                if (allChats.length > 0) {
                    setCurrentConversationId(allChats[0]._id);
                }

                // -----------------------------
                // 2. Ensure socket connected
                // -----------------------------
                if (!socket.connected) {
                    socket.connect();
                }

                // -----------------------------
                // 3. Register user with socket
                // -----------------------------
                socket.emit("register", YOUR_USER_ID);

                // -----------------------------
                // 4. Join all rooms
                // -----------------------------
                allChats.forEach((chat: Chat) => {
                    socket.emit("joinChat", chat._id);
                });

            } catch (error) {
                console.error("Failed to fetch chats or auto-join:", error);
            }
        };

        fetchChats();
    }, [accessToken, YOUR_USER_ID, YOUR_ROLE]);

    // -----------------------------
    // Fetch messages
    // -----------------------------
    useEffect(() => {
        const fetchMessages = async () => {
            if (!accessToken || !currentConversationId) return;

            try {
                const response = await axios.get(`http://localhost:3000/api/chat/${currentConversationId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                const fetchedMessages = response.data.data.map((msg: any) => ({
                    id: msg._id,
                    text: msg.message,
                    senderId: msg.sender?._id || msg.sender,
                    type: (msg.sender?._id || msg.sender) === YOUR_USER_ID ? 'sent' : 'received',
                    timestamp: msg.createdAt,
                }));

                setMessages(fetchedMessages.reverse());
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchMessages();
    }, [currentConversationId, accessToken, YOUR_USER_ID]);

    // -----------------------------
    // Socket setup
    // -----------------------------
    useEffect(() => {
        if (!socket.connected) socket.connect();

        socket.emit("register", YOUR_USER_ID);

        if (currentConversationId) {
            socket.emit("joinChat", currentConversationId);
        }

        socket.on("receiveMessage", (data: IncomingMessage) => {
            const incomingSenderId = data.senderId || data.sender || "";

            setMessages((prevMsg) => [
                ...prevMsg,
                {
                    id: Date.now().toString(),
                    text: data.message,
                    senderId: incomingSenderId,
                    type: incomingSenderId === YOUR_USER_ID ? 'sent' : 'received',
                    // ── set current time as timestamp for incoming real time socket messages ──
                    timestamp: new Date().toISOString(),
                }
            ]);

            // ──       only create notification if message is from someone else
            //           works for both student notified by counselor
            //           and counselor notified by student ──
            if (incomingSenderId !== YOUR_USER_ID) {

                // ── find sender name by looking through chat participants ──
                setChats((currentChats) => {
                    const senderChat = currentChats.find((c) =>
                        c.participants?.some((p) => p._id === incomingSenderId)
                    );
                    const senderName =
                        senderChat?.participants?.find((p) => p._id === incomingSenderId)
                            ?.name || "Someone";

                    // ── push new notification into notifications state ──
                    setNotifications((prev) => [
                        {
                            id: Date.now().toString(),
                            text: data.message,
                            senderName,
                            timestamp: new Date().toISOString(),
                            conversationId: currentConversationId,
                            isRead: false,
                        },
                        ...prev,
                    ]);

                    return currentChats;
                });
            }
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [currentConversationId, YOUR_USER_ID]);

    // ── toggle notification panel and mark all as read when opened ──
    const handleToggleNotifications = () => {
        setShowNotifications((prev) => !prev);
        // ── mark all as read when panel opens ──
        if (!showNotifications) {
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
            );
        }
    };

    // ── clear all notifications from list ──
    const handleClearNotifications = () => {
        setNotifications([]);
        setShowNotifications(false);
    };

    // ── click a notification to jump to that conversation ──
    const handleNotificationClick = (conversationId: string) => {
        setCurrentConversationId(conversationId);
        setShowNotifications(false);
    };

    // ── delete a message from UI and database ──
    const handleDeleteMessage = async (messageId: string) => {
        // ── remove message from UI immediately ──
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

        // ── delete message from database via DELETE request ──
        try {
            await axios.delete(
                `http://localhost:3000/api/chat/message/${messageId}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
        } catch (error) {
            console.error("Failed to delete message from database:", error);
        }
    };

    // -----------------------------
    // Send message
    // -----------------------------
    const handleSendMessage = async () => {
        if (!accessToken || !currentConversationId || !message.trim()) return;

        socket.emit("sendMessage", {
            message,
            roomId: currentConversationId,
            senderId: YOUR_USER_ID,
        });

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                text: message,
                senderId: YOUR_USER_ID,
                type: "sent",
                timestamp: new Date().toISOString(),
            },
        ]);

        try {
            const currentChat = chats.find(c => c._id === currentConversationId);
            const recieverId = currentChat?.participants?.find(p => p._id !== YOUR_USER_ID)?._id || "";

            await axios.post("http://localhost:3000/api/chat/send", {
                conversationId: currentConversationId,
                senderId: YOUR_USER_ID,
                recieverId,
                message,
                messageType: "text",
                attachments: [],
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
        } catch (error) {
            console.error("Failed to save message:", error);
        }

        setMessage("");
    };

    const handleChatSelect = (chat: Chat) => {
        setCurrentConversationId(chat._id);
    };

    return (
        <div className="realtime-chat-container d-flex flex-column vh-100 my-5">
            <header className="chat-header border-bottom shadow-sm py-3 px-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h1 className="chat-title text-capitalize mb-0 fw-bold fs-4">Realtime Chat</h1>

                    {/* ── notification bell icon with unread count badge ── */}
                    <div style={{ position: "relative" }}>

                        {/* ──  bell button using boxicons bx-bell-ring or bx-bell ── */}
                        <button
                            onClick={handleToggleNotifications}
                            title="Notifications"
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "1.6rem",
                                color: "var(--dark-text)",
                                position: "relative",
                                padding: "4px 8px",
                                lineHeight: 1,
                            }}
                        >
                            {/* ── bx-bell-ring when unread notifications exist else bx-bell ── */}
                            <i className={unreadCount > 0 ? "bx bx-bell-ring" : "bx bx-bell"} />

                            {/* ── red badge on bell showing unread count ── */}
                            {unreadCount > 0 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        background: "#dc3545",
                                        color: "#fff",
                                        borderRadius: "50%",
                                        fontSize: "0.62rem",
                                        fontWeight: 700,
                                        width: 17,
                                        height: 17,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        lineHeight: 1,
                                    }}
                                >
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* ── notification dropdown panel shown when bell is clicked ── */}
                        {showNotifications && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "110%",
                                    right: 0,
                                    width: 320,
                                    background: "#fff",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: 12,
                                    boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                                    zIndex: 1000,
                                    overflow: "hidden",
                                }}
                            >
                                {/* ──  panel header with bell icon and clear button ── */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "12px 16px",
                                        borderBottom: "1px solid var(--border-color)",
                                        background: "#f8f9fa",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        {/* ── bx-bell icon in panel header ── */}
                                        <i className="bx bx-bell" style={{ fontSize: "1.1rem", color: "var(--primary-color)" }} />
                                        <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                                            Notifications
                                        </span>
                                        {/* ── unread count pill in panel header ── */}
                                        {unreadCount > 0 && (
                                            <span
                                                style={{
                                                    background: "#dc3545",
                                                    color: "#fff",
                                                    borderRadius: "99px",
                                                    fontSize: "0.68rem",
                                                    fontWeight: 700,
                                                    padding: "1px 7px",
                                                }}
                                            >
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>

                                    {/* ── clear all button with bx-trash icon ── */}
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={handleClearNotifications}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "0.78rem",
                                                color: "#dc3545",
                                                fontWeight: 600,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                            }}
                                        >
                                            {/* ──  bx-trash icon using boxicons ── */}
                                            <i className="bx bx-trash" style={{ fontSize: "0.9rem" }} />
                                            Clear all
                                        </button>
                                    )}
                                </div>

                                {/* ── scrollable notifications list ── */}
                                <div style={{ maxHeight: 340, overflowY: "auto" }}>

                                    {/* ── empty state when no notifications exist ── */}
                                    {notifications.length === 0 ? (
                                        <div
                                            style={{
                                                padding: "2rem",
                                                textAlign: "center",
                                                color: "var(--muted-text)",
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            {/* ── bx-bell-off icon using boxicons for empty state ── */}
                                            <i
                                                className="bx bx-bell-off"
                                                style={{
                                                    fontSize: "2.2rem",
                                                    display: "block",
                                                    marginBottom: 8,
                                                    opacity: 0.5,
                                                }}
                                            />
                                            No notifications yet
                                        </div>
                                    ) : (
                                        // ── render each notification item ──
                                        notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                onClick={() => handleNotificationClick(notif.conversationId)}
                                                style={{
                                                    padding: "12px 16px",
                                                    borderBottom: "1px solid var(--border-color)",
                                                    cursor: "pointer",
                                                    background: notif.isRead ? "#fff" : "#eff6ff",
                                                    transition: "background 0.2s",
                                                }}
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.style.background = "#f0f4ff")
                                                }
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.background =
                                                        notif.isRead ? "#fff" : "#eff6ff")
                                                }
                                            >
                                                {/* ── top row with chat icon sender name and unread dot ── */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {/* ──  bx-message-rounded-dots icon using boxicons ── */}
                                                    <i
                                                        className="bx bx-message-rounded-dots"
                                                        style={{
                                                            fontSize: "1rem",
                                                            color: "var(--primary-color)",
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                            fontSize: "0.875rem",
                                                            color: "var(--dark-text)",
                                                            flex: 1,
                                                        }}
                                                    >
                                                        {notif.senderName}
                                                    </span>
                                                    {/* ── blue dot for unread notification ── */}
                                                    {!notif.isRead && (
                                                        <span
                                                            style={{
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: "50%",
                                                                background: "#0d6efd",
                                                                flexShrink: 0,
                                                            }}
                                                        />
                                                    )}
                                                </div>

                                                {/* ── message preview truncated to one line ── */}
                                                <p
                                                    style={{
                                                        margin: "0 0 4px 0",
                                                        fontSize: "0.82rem",
                                                        color: "var(--muted-text)",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        paddingLeft: "24px",
                                                    }}
                                                >
                                                    {notif.text}
                                                </p>

                                                {/* ── timestamp row with bx-time-five icon ── */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 4,
                                                        paddingLeft: "24px",
                                                    }}
                                                >
                                                    {/* ── bx-time-five clock icon using boxicons ── */}
                                                    <i
                                                        className="bx bx-time-five"
                                                        style={{
                                                            fontSize: "0.72rem",
                                                            color: "var(--muted-text)",
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            fontSize: "0.7rem",
                                                            color: "var(--muted-text)",
                                                        }}
                                                    >
                                                        {formatTime(notif.timestamp)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="chat-main-wrapper d-flex flex-grow-1 overflow-hidden">
                <div className="chat-sidebar border-end" style={{ width: '320px' }}>
                    <ChatsSidebar chats={Array.isArray(chats) ? chats : []} onSelectChat={handleChatSelect} currentUserId={YOUR_USER_ID} selectedChatId={currentConversationId} />
                </div>

                <main className="chat-content flex-grow-1 d-flex flex-column">
                    <div className="messages-container flex-grow-1 overflow-auto p-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`message-wrapper d-flex mb-3 ${msg.type === 'sent' ? 'justify-content-end' : 'justify-content-start'}`}
                                // ──  track hovered message to show delete button ──
                                onMouseEnter={() => setHoveredMessageId(msg.id)}
                                onMouseLeave={() => setHoveredMessageId(null)}
                            >
                                {/* ──     delete button shown on hover for sent messages only
                                           positioned before the bubble on the left side ── */}
                                {msg.type === 'sent' && hoveredMessageId === msg.id && (
                                    <button
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        title="Delete message"
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "#dc3545",
                                            padding: "0 6px",
                                            alignSelf: "center",
                                            fontSize: "1.1rem",
                                            opacity: 0.8,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {/* ── bx-trash delete icon using boxicons ── */}
                                        <i className="bx bx-trash" />
                                    </button>
                                )}

                                <div className={`message shadow-sm ${msg.type === 'sent' ? 'message-sent' : 'message-received'}`}>
                                    {msg.text}

                                    {/* ── display timestamp below each message bubble ── */}
                                    {msg.timestamp && (
                                        <div
                                            className="message-time mt-1"
                                            style={{
                                                fontSize: "0.7rem",
                                                opacity: 0.7,
                                                textAlign: msg.type === "sent" ? "right" : "left",
                                            }}
                                        >
                                            {formatTime(msg.timestamp)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="message-input-wrapper border-top shadow-sm p-3">
                        <div className="message-input-container d-flex align-items-center gap-2">
                            <input
                                type="text"
                                className="form-control message-input border-0 shadow-sm rounded-pill px-4"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                style={{ fontSize: '0.95rem' }}
                            />
                            <button
                                className="btn send-btn rounded-circle p-2 d-flex align-items-center justify-content-center"
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                                title="Send message"
                            >
                                <i className="bi bi-send-fill fs-5"></i>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default RealtimeChat;