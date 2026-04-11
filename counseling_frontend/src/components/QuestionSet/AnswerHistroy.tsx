// import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios';
import CounselorFeedbackForm from './CounselorFeedbackForm';

interface Choice {
    _id: string;
    label: string;
    text: string;
}

interface Question {
    _id: string;
    questionText: string;
    choices: Choice[];
}

interface Response {
    _id: string;
    questionId: string;
    selectedChoiceIds: string[];
}

interface Feedback {
    feedbackTitle: string;
    feedbackText: string;
    counselorId: string;
    counselorName?: string;
    createdAt?: string;
}

interface Attempt {
    _id: string;
    user: { _id: string; name: string; email: string } | null;
    questionSet: { _id: string; title: string; questions: Question[] };
    responses: Response[];
    submittedAt: string;
    feedback?: Feedback;
}

interface Roles {
    role: string;
    userId: string;
}

function AnswerHistroy({ role, userId }: Roles) {
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);

    const [selectedFeedback, setSelectedFeedback] = useState<{
        feedback: Feedback;
        attemptId: string;
        attemptTitle: string;
    } | null>(null);

    const fetchAttempts = async () => {

        if (!userId) {
            console.warn("fetchAttempts called before userId was available - skipping.");
            setLoading(false);
            return;
        }

        try {
            const accessToken = localStorage.getItem("accessToken");

            let res;
            if (role === "student") {
                res = await axios.get("http://localhost:3000/api/student/attempt-history", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });
            } else {
                res = await axios.get("http://localhost:3000/api/counselor/submissions", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });
            }

            console.log("Fetched attempts:", res.data);

            setAttempts(role === "student" ? res.data.history || [] : res.data.submissions || []);
        } catch (error) {
            console.error("Error fetching attempts:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAttempts();
    }, [role, userId]);

    if (loading) return (
        <div className="answer-history-wrapper">
            <div className="answer-history-state">
                <div className="answer-history-state-icon">⏳</div>
                <p>Loading answer history....</p>
            </div>
        </div>
    );

    if (attempts.length === 0) return (
        <div className="answer-history-wrapper">
            <div className="answer-history-state">
                <div className="answer-history-state-icon">📭</div>
                <p>No answer history found.</p>
            </div>
        </div>
    );

    // ── FIX: removed `selectedAttempt.user &&` from the gate condition ────────
    // WHY: The previous condition `selectedAttempt && selectedAttempt.user && role === "counselor"`
    //      blocked the feedback form from rendering when attempt.user was null,
    //      so clicking "Add Feedback" on the top 3 cards (null-user) did nothing.
    // CHANGE: `selectedAttempt && selectedAttempt.user && role === "counselor"`
    //      → `selectedAttempt && role === "counselor"`
    // Also added `selectedAttempt.user?._id || ""` and `selectedAttempt.user?.name || "Unknown Student"`
    //      as safe fallbacks so studentId and studentName never crash when user is null.
    // ─────────────────────────────────────────────────────────────────────────
    if (selectedAttempt && role === "counselor") {
        return (
            <div className="answer-history-wrapper">
                <div className="container">
                    <button
                        className="btn btn-secondary mt-4"
                        onClick={() => setSelectedAttempt(null)}
                    >
                        ← Back to Answer History
                    </button>

                    <CounselorFeedbackForm
                        studentId={selectedAttempt.user?._id || ""}
                        studentName={selectedAttempt.user?.name || "Unknown Student"}
                        counselorId={userId}
                        counselorName={"Counselor"}
                        answerId={selectedAttempt._id}
                        onFeedbackSaved={() => {
                            setSelectedAttempt(null);
                            fetchAttempts();
                        }}
                    />
                </div>
            </div>
        );
    }

    if (selectedFeedback && role === "student") {
        return (
            <div className="answer-history-wrapper">
                <div className="container">
                    <button
                        className="btn btn-secondary mt-4"
                        onClick={() => setSelectedFeedback(null)}
                    >
                        ← Back to Answer History
                    </button>

                    <div className="text-center mb-2 mt-4">
                        <h2 className="answer-history-page-title">Career Feedback</h2>
                        <p className="answer-history-page-subtitle">{selectedFeedback.attemptTitle}</p>
                        <div className="answer-history-header-divider mx-auto"></div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-9 col-xl-8">

                            {/* ── ADDED: feedback block with inline styles so it works
                                without needing external CSS classes defined ── */}
                            <div
                                style={{
                                    background: "#ffffff",
                                    border: "1px solid #e2e8f0",
                                    borderLeft: "4px solid #4f6ef7",
                                    borderRadius: "16px",
                                    padding: "2rem",
                                    marginTop: "1rem",
                                    boxShadow: "0 2px 8px rgba(26,31,54,0.07)",
                                }}
                            >
                                {/* ── ADDED: feedback header row with icon and label ── */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        color: "#4f6ef7",
                                        marginBottom: "1.25rem",
                                    }}
                                >
                                    <i className='bx bx-comment-detail' style={{ fontSize: "1rem" }}></i>
                                    <span>Counselor Feedback</span>
                                </div>

                                {/* ── ADDED: feedback title with styled heading ── */}
                                <div
                                    style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: "1.2rem",
                                        fontWeight: 700,
                                        color: "#1a1f36",
                                        marginBottom: "1rem",
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {selectedFeedback.feedback.feedbackTitle}
                                </div>

                                {/* ── ADDED: feedback body text with background box ── */}
                                <div
                                    style={{
                                        fontSize: "0.95rem",
                                        color: "#4a5568",
                                        lineHeight: 1.8,
                                        whiteSpace: "pre-wrap",
                                        marginBottom: "1.25rem",
                                        padding: "1rem",
                                        background: "#f7f8fc",
                                        borderRadius: "8px",
                                        border: "1px solid #e4e8f0",
                                    }}
                                >
                                    {selectedFeedback.feedback.feedbackText}
                                </div>

                                {/* ── ADDED: date/time meta row at bottom of feedback ── */}
                                {selectedFeedback.feedback.createdAt && (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            fontSize: "0.78rem",
                                            color: "#6b7694",
                                            marginTop: "0.75rem",
                                            paddingTop: "0.75rem",
                                            borderTop: "1px solid #e4e8f0",
                                        }}
                                    >
                                        <i
                                            className='bx bx-time-five'
                                            style={{ fontSize: "0.9rem", color: "#4f6ef7" }}
                                        ></i>
                                        {new Date(selectedFeedback.feedback.createdAt).toLocaleString()}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="answer-history-wrapper">
            <div className="container">

                {/* Page Header */}
                <div className="text-center mb-2 mt-5">
                    <h2 className="answer-history-page-title">Answer History</h2>
                    <p className="answer-history-page-subtitle">
                        {role === "counselor"
                            ? `Reviewing all student submissions`
                            : `Your submitted responses`}
                    </p>
                    <div className="answer-history-header-divider mx-auto"></div>
                </div>

                {/* Attempt Cards */}
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-9 col-xl-8">

                        {attempts.map((attempt) => (
                            <div key={attempt._id} className="answer-history-card">

                                {/* Card Header */}
                                <div className="answer-history-card-header">
                                    <div>
                                        <h3 className="answer-history-card-title">{attempt.questionSet.title}</h3>

                                        {role === "counselor" && attempt.user && (
                                            <span className="answer-history-student-badge">
                                                <i className='bx bx-user'></i>
                                                {attempt.user.name}
                                            </span>
                                        )}
                                    </div>

                                    <span className="answer-history-time-chip">
                                        <i className='bx bx-time-five'></i>
                                        {new Date(attempt.submittedAt).toLocaleString()}
                                    </span>
                                </div>

                                {/* Card Body — Questions & Answers */}
                                <div className="answer-history-card-body">
                                    <ul className="answer-history-q-list">
                                        {attempt.responses.map((resp, i) => {

                                            const question = attempt.questionSet.questions.find(
                                                (q) => q._id === resp.questionId.toString()
                                            );

                                            const selectedChoices = question?.choices.filter((c) =>
                                                resp.selectedChoiceIds.map(id => id.toString()).includes(c._id.toString())
                                            );

                                            return (
                                                <li key={i} className="answer-history-q-item">
                                                    <div className="answer-history-q-label">Question {i + 1}</div>
                                                    <div className="answer-history-q-text">
                                                        {question?.questionText}
                                                    </div>
                                                    <div className="answer-history-a-label">Answer</div>
                                                    <div>
                                                        {selectedChoices && selectedChoices.length > 0
                                                            ? selectedChoices.map((c, ci) => (
                                                                <span key={ci} className="answer-history-a-chip">
                                                                    {c.text}
                                                                </span>
                                                            ))
                                                            : <span className="answer-history-a-na">N/A</span>
                                                        }
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {/* View Feedback Button for Student */}
                                    {role === "student" && attempt.feedback && (
                                        <div className="form-footer mt-3">
                                            <button
                                                className="submit-button"
                                                onClick={() =>
                                                    setSelectedFeedback({
                                                        feedback: attempt.feedback!,
                                                        attemptId: attempt._id,
                                                        attemptTitle: attempt.questionSet.title,
                                                    })
                                                }
                                            >
                                                <span className="button-text">View Feedback</span>
                                                <i className='bx bx-right-arrow-alt button-icon'></i>
                                            </button>
                                        </div>
                                    )}

                                </div>

                                {role === "counselor" && (
                                    <div className="form-footer">
                                        <button
                                            className="submit-button"
                                            onClick={() => setSelectedAttempt(attempt)}
                                        >
                                            <span className="button-text">Add Feedback</span>
                                            <i className='bx bx-right-arrow-alt button-icon'></i>
                                        </button>
                                    </div>
                                )}

                            </div>
                        ))}

                    </div>
                </div>

            </div>
        </div>
    )
}

export default AnswerHistroy;