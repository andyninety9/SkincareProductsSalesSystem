import api from "../../config/api.jsx";


const quizService = {
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