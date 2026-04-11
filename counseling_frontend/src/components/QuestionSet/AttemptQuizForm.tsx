// import React, { useState } from "react";
import {
    FormProvider,
    useFieldArray,
    useForm,
    useFormContext,
} from "react-hook-form";
import axios from "axios";

import { useState } from "react";
import type { IAttemptQuestionSetForm } from "../../pages/QuestionSet/AttemptQuizPage";
import { useNavigate } from "react-router-dom";


export interface IAttemptQuizFinalData {
    questionSet: string;
    responses: {
        questionId: string;
        selectedChoiceIds: string[]; // FIXED: was "selectedChoicesIds" (extra 's') — caused selectedChoiceIds to always be empty array in DB
    }[];
}
interface IResult {
    feedbackTitle?: string;
    feedbackText?: string;
    counselorName?: string;
}


function AttemptQuizForm({
    questionSet,
}: {
    questionSet: IAttemptQuestionSetForm;
}) {
    const [result, setResult] = useState<IResult | null>(null);
    const navigate = useNavigate();

    const defaultValues: IAttemptQuestionSetForm = {
        ...questionSet,
    };
    const methods = useForm({ defaultValues });

    const { watch, register, handleSubmit } = methods;
    console.log("form values => ", watch());

    const onSubmitHandler = (data: IAttemptQuestionSetForm) => {
        const accessToken = localStorage.getItem("accessToken");

        const finalData: IAttemptQuizFinalData = {
            questionSet: data?._id,
            responses: data?.questions?.map((question) => {
                return {
                    questionId: question?._id,
                    selectedChoiceIds: question?.choices // FIXED: was "selectedChoicesIds" (extra 's') — this was sending wrong key to backend, so backend received nothing and saved empty array, causing N/A in history
                        ?.filter((choice: any) => choice?.selected)
                        ?.map((ch: any) => ch?._id),
                };
            }),
        };

        // Keeping original api as it is for endpoint.
        axios
            .post("http://localhost:3000/api/question/answer/attempt", finalData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((res) => {
                alert("Answer Set Updated Successfully");
                setResult(res.data.data);
            })
            .catch((err) => { 
                console.error(err);
            });
    };


    // Result display section to show counselor feedback from CounselorFeedbackForm
    // Student can now view feedbackTitle and feedbackText when counselor provides feedback
    if (result) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center p-4" style={{ background: "linear-gradient(to bottom right, #4B0082, #00008B, #4B0082)" }}>
                {/* maximum width style to container for better feedback display */}
                <div className="text-center p-5 rounded-4 border border-light border-opacity-25 bg-white bg-opacity-10" style={{ maxWidth: "700px", width: "100%" }}>
                    <div className="mx-auto mb-4 d-flex justify-content-center align-items-center rounded-circle" style={{ width: "80px", height: "80px", background: "linear-gradient(to bottom right, #22c55e, #eab308)", fontSize: "2rem", fontWeight: "700", color: "white" }}>
                        Q
                    </div>
                    <h2 className="text-warning fw-bold mb-3">Quiz Complete!</h2>

                    {/* ADDED: Display score if available */}
                    {/* {(result?.score !== undefined && result?.total !== undefined) && (
                        <p className="text-white-50 fs-5 mb-4">
                            Your Score is: <span className="text-success fw-bold">{result?.score || 0}</span> out of{" "}
                            <span className="text-warning fw-bold">{result?.total || 0}</span> questions.
                        </p>
                    )} */}

                    {/* Displaying feedbackTitle from CounselorFeedbackForm if counselor provided it */}
                    {result?.feedbackTitle && (
                        <div className="mt-4 p-4 rounded-3 bg-white bg-opacity-10 border border-light border-opacity-25 text-start">
                            <h5 className="text-warning fw-bold mb-3">
                                <i className='bx bx-message-square-detail me-2'></i>
                                Feedback: {result?.feedbackTitle}
                            </h5>
                        </div>
                    )}

                    {/* Displaying feedbackText from CounselorFeedbackForm - detailed feedback from counselor */}
                    {result?.feedbackText && (
                        <div className="mt-3 p-4 rounded-3 bg-white bg-opacity-10 border border-light border-opacity-25 text-start">
                            <h5 className="text-info fw-bold mb-3">
                                <i className='bx bx-comment-detail me-2'></i>
                                Detailed Feedback:
                            </h5>
                            <p className="text-white mb-0" style={{ lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
                                {result?.feedbackText}
                            </p>
                        </div>
                    )}

                    {/* Displaying counselorName if available to show who provided the feedback */}
                    {result?.counselorName && (
                        <div className="mt-3 text-end">
                            <p className="text-white-50 mb-0 fst-italic">
                                <i className='bx bx-user me-1'></i>
                                Feedback provided by: <span className="text-warning fw-semibold">{result?.counselorName}</span>
                            </p>
                        </div>
                    )}

                    {/* Fallback message when counselor has not  provided feedback yet */}
                    {!result?.feedbackTitle && !result?.feedbackText && (
                        <p className="text-white-50 fs-6 mt-4 fst-italic">
                            Counselor feedback will be available once your submission is reviewed.
                        </p>
                    )}

                    {/* View Answer History button is added so that student can view their own answer history */}
                    <button className="btn btn-warning fw-bold mt-4 px-5 text-capitalize" onClick={() => navigate("/student/attempt-history")}>
                        view attempt history
                    </button>
                </div>
            </div>
        );
    }

    // NO CHANGES BELOW THIS LINE - Rest of the form remains exactly the same
    return (
        <div className="min-vh-100 p-4" style={{ background: "linear-gradient(to bottom right, #4B0082, #00008B, #4B0082)" }}>
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-warning mb-3">
                    <span className="fs-3">✨</span> My Question Sets <span className="fs-3">✨</span>
                </h1>
            </div>

            {/* Quiz Form */}
            <div className="container">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmitHandler)} className="mb-5">
                        {/* Title Section */}
                        <div className="p-4 rounded-4 border border-light border-opacity-25 bg-white bg-opacity-10 mb-4">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="d-flex justify-content-center align-items-center rounded-circle text-white fw-bold" style={{ width: "64px", height: "64px", background: "linear-gradient(to bottom right, #22c55e, #eab308)", fontSize: "1.5rem" }}>
                                    Q
                                </div>
                                <div>
                                    <h2 className="text-warning fw-bold">{questionSet?.title || "Quiz"}</h2>
                                    {/* ADDEDING SUBTITLE HERE (from questionSet) */}
                                    {/* {questionSet?.subtitle && (
                                        <p className="text-white-50 mt-2">
                                            {questionSet?.subtitle}
                                        </p>
                                    )} */}
                                    <p className="text-white-50 mb-0">— {questionSet?.questions?.length || 0} questions</p>
                                </div>
                            </div>

                            {/* <div className="mb-3">
                                <label className="form-label text-white-50 fw-medium">Enter Title</label>
                                <input
                                    {...register("title")}
                                    placeholder="Enter Title"
                                    className="form-control bg-white bg-opacity-10 border border-light border-opacity-25 text-white"
                                />
                            </div> */}
                        </div>

                        <CreateQuestions />

                        {/* Submit Button */}
                        <div className="d-flex justify-content-center pt-3">
                            <button type="submit" className="btn btn-success btn-lg fw-bold px-5 d-flex align-items-center gap-2">
                                <span>🚀</span>
                                Submit
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}

function CreateQuestions() {
    const { control } = useFormContext<IAttemptQuestionSetForm>();

    const { fields } = useFieldArray({
        control,
        name: "questions",
    });

    return (
        <div className="mb-4">
            <div className="text-center mb-4">
                <h2 className="text-warning fw-bold mb-2">Questions</h2>
                <p className="text-white-50">Answer all questions below</p>
            </div>

            {fields?.map((field, index) => {

                // const question = field as {
                //     _id: string;
                //     questionText: string;
                //     subtitle?: string;
                // }
                return (
                    <div key={index} className="p-4 rounded-4 border border-light border-opacity-25 bg-white bg-opacity-10 mb-3">
                        <div className="d-flex align-items-start gap-3 mb-3">
                            <div className="d-flex justify-content-center align-items-center rounded-circle text-white fw-bold mt-1" style={{ width: "40px", height: "40px", background: "linear-gradient(to bottom right, #22c55e, #eab308)" }}>
                                {index + 1}
                            </div>

                            <div key={field._id}>
                                {/* Displaying subtitle before questions */}
                                {/* {question?.subtitle && (
                                    <p className="text-white-50 mb-1">
                                        {question?.subtitle}
                                    </p>
                                )} */}
                            </div>
                            <h3 className="text-white fw-semibold">{field?.questionText}</h3>
                        </div>

                        <CreateChoices questionIndex={index} />
                    </div>
                );
            })}
        </div>
    );
}

function CreateChoices({ questionIndex }: { questionIndex: number }) {
    const { register, control } = useFormContext<IAttemptQuestionSetForm>();

    const { fields } = useFieldArray({
        control,
        name: `questions.${questionIndex}.choices` as any,
    });

    const colors = [
        'linear-gradient(to bottom right, #f97316, #ef4444)',
        'linear-gradient(to bottom right, #22c55e, #10b981)',
        'linear-gradient(to bottom right, #ec4899, #8b5cf6)',
        'linear-gradient(to bottom right, #3b82f6, #06b6d4)',
        'linear-gradient(to bottom right, #facc15, #f97316)',
        'linear-gradient(to bottom right, #8b5cf6, #ec4899)'
    ];

    return (
        <div className="ms-5">
            {fields?.map((field, index) => {
                const colorScheme = colors[index % colors.length];

                return (
                    <div key={index} className="form-check mb-2 p-3 rounded-3" style={{ background: "#ffffff0a", border: "1px solid #ffffff1a", cursor: "pointer" }}>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            {...register(`questions.${questionIndex}.choices.${index}.selected` as any)}
                            id={`question-${questionIndex}-choice-${index}`}
                        />
                        <label className="form-check-label text-white-50 ms-3" htmlFor={`question-${questionIndex}-choice-${index}`}>
                            {field?.text}
                        </label>
                    </div>
                );
            })}
        </div>
    );
}

export default AttemptQuizForm;