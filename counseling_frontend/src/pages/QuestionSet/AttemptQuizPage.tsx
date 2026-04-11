// import React from 'react'

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AttemptQuizForm from "../../components/QuestionSet/AttemptQuizForm";

export interface IAttemptQuestionSetForm {
    _id: string;
    // subtitle?: string;
    title: string;
    questions: IQuestion[];
    createdBy: string;
    _v: number;
}

export interface IQuestion {
    questionText: string;
    choices: string[];
    _id: string;
}

export interface IChoice {
    label: string;
    text: string;
    _id: string;
    selected?: boolean;
}
function AttemptQuizPage() {
    const { id } = useParams();

    const [questionSet, setQuestionSet] = useState<IAttemptQuestionSetForm>([]);
    const [isloading, setIsLoading] = useState<boolean>(true);
    // const Navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken || !id) {
            setIsLoading(false);
            return;
        }

        async function fetchData() {
            axios
                .get(`http://localhost:3000/api/question/set/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((response) => {
                    setQuestionSet(response?.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setIsLoading(false);
                });
        }
        fetchData();
    }, [id]);

    if (isloading) {
        return <p>Loading...</p>;
    }
    return (
        <div>
            {questionSet ? <AttemptQuizForm questionSet={questionSet} /> : null}
        </div>
    );
}

export default AttemptQuizPage;
