// import React from 'react'

import CorretAnswerHistroy from "../../components/QuestionSet/AnswerHistroy";

function CorrectAnswerHistroyPage() {
    const questionId = ""; // provide questionId from route params or state
    const accessToken = localStorage.getItem("accessToken") || "";

    return (
        <div>
            <CorretAnswerHistroy
                questionId={questionId}
                accessToken={accessToken}
            />
        </div>
    );
}

export default CorrectAnswerHistroyPage;
