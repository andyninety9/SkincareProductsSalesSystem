// src/services/quizService.js
import api from '../config/api';

const quizService = {
    // Fetch all quiz items with pagination
    getAllQuizItems: async (page, pageSize) => {
        try {
            const response = await api.get(`Question/get-all?page=${page}&pageSize=${pageSize}`);
            if (response.status !== 200) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch quiz items');
        }
    },

    // Create a new question
    createQuestion: async (questionData) => {
        try {
            const response = await api.post('Question/create', questionData);
            if (response.status !== 201) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.message || 'Failed to create question');
        }
    },

    // Update an existing question
    updateQuestion: async (questionId, questionData) => {
        try {
            const response = await api.put(`Question/update/${questionId}`, questionData);
            if (response.status !== 200) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.message || 'Failed to update question');
        }
    },

    // Delete a question
    deleteQuestion: async (questionId) => {
        try {
            const response = await api.delete(`Question/delete/${questionId}`);
            if (response.status !== 200) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.message || 'Failed to delete question');
        }
    },
};

export default quizService;