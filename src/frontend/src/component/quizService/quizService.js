import api from '../../config/api.jsx';

const quizService = {
    getAllQuizItems: async (keyword, page, pageSize) => {
        try {
            const response = await api.get(`Question/get-all?keyword=${keyword}&page=${page}&pageSize=${pageSize}`);
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
                throw new Error(
                    `HTTP Error: ${response.status}. Details: ${errorDetail}${specificErrors ? ` Errors: ${specificErrors}` : ''
                    }`
                );
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
    updateQuestion: async (questionData) => {
        try {
            const payload = {
                questionId: String(questionData.questionId),
                cateQuestionId: String(questionData.cateQuestionId),
                questionContent: String(questionData.questionContent || ''),
            };
            console.log('POST Payload for updateQuestion:', JSON.stringify(payload, null, 2));
            const response = await api.post('Question/update', payload, {
                headers: { 'Content-Type': 'application/json' },
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
            if (!questionId) {
                throw new Error('questionId is required but was not provided');
            }
            const payload = { questionId: String(questionId) };
            console.log('DELETE Payload for deleteQuestion:', JSON.stringify(payload, null, 2));
            const response = await api.delete('Question/delete', {
                data: payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('deleteQuestion Response:', JSON.stringify(response, null, 2));
            if (response.status !== 200 && response.status !== 204) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.data;
        } catch (error) {
            console.error('Error in deleteQuestion:', JSON.stringify(error.response?.data || error.message, null, 2));
            throw new Error(error.response?.data?.message || error.message || 'Failed to delete question');
        }
    },
    updateAnswer: async (answerData) => {
        // Remove questionId parameter if not needed
        try {
            const payload = {
                keyId: String(answerData.keyId),
                keyContent: String(answerData.keyContent || ''),
                keyScore: String(answerData.keyScore || ''),
            };
            console.log('PATCH Payload:', JSON.stringify(payload, null, 2));
            const response = await api.patch('Question/update-answer', payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status !== 200 && response.status !== 204) {
                // Accept 200 OK or 204 No Content
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.message || 'Failed to update answer');
        }
    },

    createAnswer: async (answerData) => {
        try {
            const payload = {
                questionId: String(answerData.questionId),
                keyContent: String(answerData.keyContent || ''),
                keyScore: String(answerData.keyScore || ''),
            };
            console.log('POST Payload for createAnswer:', JSON.stringify(payload, null, 2));
            const response = await api.post('Question/create-answer', payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status !== 200) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.message || 'Failed to create answer');
        }
    },
    deleteAnswer: async (keyId) => {
        try {
            const payload = { keyId: String(keyId) };
            console.log('DELETE Payload for deleteAnswer:', JSON.stringify(payload, null, 2));
            const response = await api.delete('Question/delete-answer', {
                data: payload,
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status !== 200 && response.status !== 204) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.message || 'Failed to delete answer');
        }
    },
};
export default quizService;
