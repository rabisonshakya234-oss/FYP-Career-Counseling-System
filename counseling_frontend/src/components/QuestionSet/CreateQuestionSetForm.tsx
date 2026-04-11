import axios from "axios";
import {
    FormProvider,
    useFieldArray,
    useForm,
    useFormContext,
} from "react-hook-form";


export interface QuestionSetForm {
    title: string;
    questions: {
        questionText: string;
        // subtitle?: string;
        choices: { text: string; label: string; correctAnswer: boolean }[];
    }[];
}

function CreateQuestionSetForm() {
    const defaultValues: QuestionSetForm = {
        title: "",
        questions: [
            {
                questionText: "",
                choices: [],
                // subtitle: "",
            },
        ],
    };

    const methods = useForm({ defaultValues });
    const { watch, register, handleSubmit } = methods;
    console.log("form values => ", watch());

    const onSubmitHandler = (data: QuestionSetForm) => {

        axios
            .post("http://localhost:3000/api/counselor/questionset/create", data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            })
            .then((response) => {
                console.log("Question set created successfully:", response.data);
            })
            .catch((error) => {
                console.error("Error creating question set:", error);

                console.error("Backend error details:", error.response?.data);
            });
    };

    return (
        <div className="min-vh-100 bg-primary bg-gradient py-4 px-3">
            <div className="container">
                <div className="card shadow-lg p-4">
                    <div className="text-center mb-4">
                        <h1 className="fw-bold">Create Question Set</h1>
                        <p className="text-muted">
                            Build your custom question set with multiple choice answers
                        </p>
                    </div>

                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmitHandler)}>
                            <div className="mb-4 p-3 bg-light rounded border">
                                <label className="form-label fw-semibold">
                                    Enter Title
                                </label>
                                <input
                                    {...register("title")}
                                    placeholder="Enter Title"
                                    className="form-control"
                                />
                            </div>

                            <CreateQuestions />

                            <button
                                type="submit"
                                className="btn btn-primary w-100 mt-4"
                            >
                                Create QuestionSet
                            </button>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
}

function CreateQuestions() {
    const { register, control } = useFormContext<QuestionSetForm>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "questions",
    });

    const showSubtitle = true;

    const AddQuestionHandler = () => {
        append({
            choices: [],
            questionText: "",
            // subtitle: "",
        });
    };

    return (
        <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold">Questions</h4>
                <button
                    type="button"
                    onClick={AddQuestionHandler}
                    className="btn btn-success"
                >
                    + Add Questions
                </button>
            </div>

            {fields.map((field, index) => {
                const RemoveQuestionHandler = () => {
                    remove(index);
                };

                return (
                    <div key={index} className="card mb-3 p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-semibold">
                                Question {index + 1}
                            </h6>
                            {fields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={RemoveQuestionHandler}
                                    className="btn btn-danger btn-sm"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        {/* Subtitle input field */}
                        {/* {showSubtitle && (
                            <input
                                {...register(`questions.${index}.subtitle`)}
                                placeholder="Enter your Subtitle"
                                className="form-control mb-3"
                            />
                        )} */}

                        {/* Question Text Input field */}
                        <input
                            {...register(`questions.${index}.questionText`)}
                            placeholder="Enter Questions"
                            className="form-control mb-3"
                        />


                        <CreateChoices questionIndex={index} />
                    </div>
                );
            })}
        </div>
    );
}

function CreateChoices({ questionIndex }: { questionIndex: number }) {
    const { register, control } = useFormContext<QuestionSetForm>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: `questions.${questionIndex}.choices`,
    });

    const AddChoicesHandler = () => {
        append({
            label: String(fields.length),
            text: "",
            correctAnswer: false,
        });
    };

    return (
        <div className="bg-light p-3 rounded border">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-semibold">Answer Choices</h6>
                <button
                    type="button"
                    onClick={AddChoicesHandler}
                    className="btn btn-success btn-sm"
                >
                    + Add Choices
                </button>
            </div>

            {fields.map((field, index) => {
                const RemoveChoiceHandler = () => {
                    remove(index);
                };

                return (
                    <div key={index} className="d-flex align-items-center gap-2 mb-2">
                        <input
                            {...register(
                                `questions.${questionIndex}.choices.${index}.correctAnswer`
                            )}
                            type="checkbox"
                            className="form-check-input"
                        />

                        <span className="badge bg-primary">
                            {String.fromCharCode(65 + index)}
                        </span>

                        <input
                            {...register(
                                `questions.${questionIndex}.choices.${index}.text`
                            )}
                            placeholder="Enter Choice"
                            className="form-control"
                        />

                        <button
                            type="button"
                            onClick={RemoveChoiceHandler}
                            className="btn btn-danger btn-sm"
                        >
                            ✕
                        </button>
                    </div>
                );
            })}

            {fields.length === 0 && (
                <p className="text-center text-muted mt-3">
                    No choices added yet. Click "Add Choices" to get started.
                </p>
            )}
        </div>
    );
}

export default CreateQuestionSetForm;
