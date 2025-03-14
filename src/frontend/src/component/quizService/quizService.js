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
        console.log('Request Data:', JSON.stringify(questionData, null, 2));
        try {
            const response = await api.post('Question/create', questionData);
            if (response.status !== 200 && response.status !== 201) {
                const errorData = response.data;
                console.log('Error Response:', JSON.stringify(errorData, null, 2));
                const errorDetail = errorData.detail || 'No details provided';
                const specificErrors = errorData.errors ? JSON.stringify(errorData.errors) : '';
                throw new Error(`HTTP Error: ${response.status}. Details: ${errorDetail}${specificErrors ? ` Errors: ${specificErrors}` : ''}`);
            }
            console.log('Success Response:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error) {
            const errorData = error.response?.data;
            console.log('Error Response (catch):', JSON.stringify(errorData, null, 2));
            const errorMessage = errorData?.detail || error.message || 'Failed to create question';
            const specificErrors = errorData?.errors ? JSON.stringify(errorData.errors) : '';
            throw new Error(`${errorMessage}${specificErrors ? ` Errors: ${specificErrors}` : ''}`);
        }
    },
    updateQuestion: async (questionId, questionData) => {
        try {
            const response = await api.post('Question/update', {
                ...questionData,
                questionId,
            });
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
            const response = await api.delete('Question/delete', {
                data: { questionId },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status !== 200) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.message || 'Failed to delete question');
        }
    },

    updateAnswer: async (questionId, keyQuestions) => {
        try {
            // Ensure all fields are strings
            const formattedKeyQuestions = keyQuestions.map(answer => ({
                keyId: String(answer.keyId || ''), // Convert to string, default to empty string if null
                keyContent: String(answer.keyContent || ''),
                keyScore: String(answer.keyScore || ''),
            }));

            const response = await api.put('/api/Question/update-answer', {
                questionId: String(questionId), // Ensure questionId is a string
                keyQuestions: formattedKeyQuestions,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status !== 200) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.message || 'Failed to update answers');
        }
    },
};
export default quizService;