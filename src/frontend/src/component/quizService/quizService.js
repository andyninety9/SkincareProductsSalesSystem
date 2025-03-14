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

    updateAnswer: async (keyId, answerData) => {
        console.log('Update Answer Request Data:', JSON.stringify(answerData, null, 2));
        try {
            const response = await api.put('Question/update-answer', { keyId, ...answerData });
            if (response.status !== 200 && response.status !== 201) {
                const errorData = response.data;
                console.log('Error Response:', JSON.stringify(errorData, null, 2));
                const errorDetail = errorData.detail || 'No details provided';
                const specificErrors = errorData.errors ? JSON.stringify(errorData.errors) : '';
                throw new Error(`HTTP Error: ${response.status}. Details: ${errorDetail}${specificErrors ? ` Errors: ${specificErrors}` : ''}`);
/*************  ✨ Codeium Command ⭐  *************/
    /**
     * Update an existing answer.
     * @param {number} keyId The ID of the answer to be updated.
     * @param {object} answerData The updated answer data, containing at least `keyContent` and `keyScore`.
     * @returns {Promise<object>} The updated answer object.
     * @throws {Error} If the request fails, an error will be thrown with the error message.
     */
/******  be643bda-91b9-4ab6-ab6a-18ed7c2021fc  *******/            }
            console.log('Update Answer Success Response:', JSON.stringify(response.data, null, 2));
            return response.data.data || response.data; // Adjust based on response structure
        } catch (error) {
            const errorData = error.response?.data;
            console.log('Error Response (catch):', JSON.stringify(errorData, null, 2));
            const errorMessage = errorData?.detail || error.message || 'Failed to update answer';
            const specificErrors = errorData?.errors ? JSON.stringify(errorData.errors) : '';
            throw new Error(`${errorMessage}${specificErrors ? ` Errors: ${specificErrors}` : ''}`);
        }
    },
};

export default quizService;