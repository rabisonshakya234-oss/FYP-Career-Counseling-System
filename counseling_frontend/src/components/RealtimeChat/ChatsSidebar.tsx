interface Participant {
    _id: string;
    name: string;
}

interface Chat {
    _id: string;
    participants: Participant[];
    conversationType?: string;
    name?: string;
    field?: string;
}

interface ChatsSidebarData {
    chats: Chat[];
    onSelectChat: (chat: Chat) => void;
    currentUserId: string;
    selectedChatId?: string;
}

function ChatsSidebar({ chats, onSelectChat, currentUserId, selectedChatId }: ChatsSidebarData) {
    function getOtherParticipant(chat: Chat): Participant | null {
        if (!chat.participants?.length) return null;
        return chat.participants.find((p) => p._id !== currentUserId) || chat.participants[0];
    }

    return (
        <aside className="chats-sidebar h-100 d-flex flex-column">
            <h2 className="sidebar-title px-3 py-3 mb-0 border-bottom fw-semibold fs-2 text-capitalize">
                chats
            </h2>
            <div className="chats-list flex-grow-1 overflow-auto">
                {chats.length === 0 && (
                    <div className="px-3 py-4 text-muted text-center" style={{ fontSize: "0.9rem" }}>
                        No conversations yet
                    </div>
                )}
                {chats.map((chat) => {
                    const other = getOtherParticipant(chat);
                    const displayName = other?.name || "Unknown";
                    const isSelected = chat._id === selectedChatId;
                    return (
                        <div
                            key={chat._id}
                            onClick={() => onSelectChat(chat)}
                            className="chat-item d-flex align-items-center gap-3 px-3 py-3 border-bottom"
                            style={{ cursor: "pointer", background: isSelected ? "#cfe2ff" : undefined }}
                        >
                            <div
                                className="rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center text-white fw-bold"
                                style={{ width: 42, height: 42, background: "linear-gradient(135deg,#0d6efd,#6610f2)", fontSize: "1rem" }}
                            >
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-grow-1 d-flex flex-column">
                                <span className="fw-medium fs-5 text-truncate">{displayName}</span>
                                <small className="text-muted" style={{ fontSize: "0.78rem" }}>
                                    {chat.conversationType || "Counseling"}
                                </small>
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}

export default ChatsSidebar;