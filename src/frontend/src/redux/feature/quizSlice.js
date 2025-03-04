import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    quizId: null,
    questionNumber: 0,
    questionId: null,
    questionText: '',
    category: '',
    keyQuestions: [],
    answers: [],
    resultQuiz: {},
    isFinalQuestion: false,
};

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        startQuiz: (state, action) => {
            state.quizId = action.payload.quizId;
            state.questionNumber = 1;
            state.questionId = action.payload.questionId;
            state.questionText = action.payload.questionText;
            state.category = action.payload.category || '';
            state.keyQuestions = action.payload.keyQuestions;
            state.answers = [];
            state.resultQuiz = {};
            state.isFinalQuestion = false;
        },

        nextQuestion: (state, action) => {
            state.questionNumber = action.payload.questionNumber;
            state.questionId = action.payload.questionId;
            state.questionText = action.payload.questionText;
            state.category = action.payload.category || '';
            state.keyQuestions = action.payload.keyQuestions;
            state.resultQuiz = action.payload.resultQuiz;
            state.isFinalQuestion = action.payload.isFinalQuestion;
        },

        saveAnswer: (state, action) => {
            state.answers.push({
                questionId: state.questionId,
                keyId: action.payload.keyId,
                keyScore: action.payload.keyScore,
            });
        },

        resetQuiz: () => initialState,
    },
});

export const { startQuiz, nextQuestion, saveAnswer, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
