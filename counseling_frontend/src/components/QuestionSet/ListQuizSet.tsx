import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface IListQuestionSet {
    _id: string;
    title: string;
    questionCount: number;
}

function ListQuizSet() {
    const [questionSets, setQuestionSet] = useState<IListQuestionSet[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const Navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            setIsLoading(false);
            return;
        }

        async function fetchData() {
            axios
                .get("http://localhost:3000/api/question/set/list", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((response) => {
                    setQuestionSet(response?.data?.questionSet);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ background: "linear-gradient(to bottom right, #3b82f6, #8b5cf6, #4f46e5)" }}>
                <p className="text-white fs-4 fw-semibold p-4 rounded-3 border border-white border-opacity-25 bg-white bg-opacity-10">
                    Loading...
                </p>
            </div>
        );
    }

    if (questionSets.length === 0) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ background: "linear-gradient(to bottom right, #3b82f6, #8b5cf6, #4f46e5)" }}>
                <p className="text-white fs-4 fw-semibold p-4 rounded-3 border border-white border-opacity-25 bg-white bg-opacity-10">
                    No question sets found.
                </p>
            </div>
        );
    }

    const cardColors = [
        { bg: "linear-gradient(to right, #f97316, #ef4444)", circle: "bg-warning" },
        { bg: "linear-gradient(to right, #34d399, #14b8a6)", circle: "bg-success" },
        { bg: "linear-gradient(to right, #ec4899, #8b5cf6)", circle: "bg-danger" },
        { bg: "linear-gradient(to right, #3b82f6, #6366f1)", circle: "bg-primary" },
        { bg: "linear-gradient(to right, #facc15, #f97316)", circle: "bg-warning" },
        { bg: "linear-gradient(to right, #06b6d4, #3b82f6)", circle: "bg-info" },
    ];

    const quizLogoUrl = "http://plus.unsplash.com/premium_photo-1669077046862-9283191f4ed7?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    return (
        <div className="min-vh-100 py-5 px-3" style={{ background: "linear-gradient(to bottom right, #1e3a8a, #4b0082, #db2777)" }}>
            <div className="container position-relative">
                <h2 className="text-center display-4 fw-extrabold text-white mb-5" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
                    ✨ My Question Sets ✨
                </h2>

                <div className="row g-4">
                    {questionSets.map((question, index) => {
                        const TakeQuizHandler = () => {
                            Navigate(`/questionset/${question._id}/attempt`);
                        };
                        const colorScheme = cardColors[index % cardColors.length];

                        return (
                            <div key={question._id} className="col-12 col-md-6 col-lg-4">
                                <div
                                    className="position-relative rounded-4 border border-white border-opacity-25 p-4 d-flex flex-column align-items-center text-center"
                                    style={{
                                        background: "rgba(255,255,255,0.1)",
                                        transition: "all 0.5s",
                                        overflow: "hidden"
                                    }}
                                >
                                    {/* Sparkle effects (simplified for Bootstrap) */}
                                    <span className="position-absolute top-0 end-0 text-warning opacity-0 transition-opacity" style={{ transition: "opacity 0.3s" }}>✨</span>
                                    <span className="position-absolute bottom-0 start-0 text-pink-300 opacity-0 transition-opacity" style={{ transition: "opacity 0.3s 0.2s" }}>💫</span>

                                    {/* Quiz Logo */}
                                    <div className="position-relative mb-3" style={{ width: "80px", height: "80px" }}>
                                        <img src={quizLogoUrl} alt="Quiz Logo" className="rounded-circle w-100 h-100 object-fit-cover shadow" />
                                    </div>

                                    <div className="flex-grow-1">
                                        <strong className="d-block fs-4 text-white mb-1" style={{ background: "-webkit-linear-gradient(90deg, #fcd34d, #f9a8d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                            {question.title}
                                        </strong>
                                        <span className="text-white-50 fs-6 fw-semibold">— {question.questionCount} questions</span>
                                    </div>

                                    <button
                                        onClick={TakeQuizHandler}
                                        className="btn btn-lg text-white fw-bold mt-3 w-100"
                                        style={{
                                            background: colorScheme.bg,
                                            borderRadius: "1rem",
                                            transition: "all 0.5s"
                                        }}
                                    >
                                        🚀 Take Quiz
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ListQuizSet;
