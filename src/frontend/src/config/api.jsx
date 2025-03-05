import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Get base URL from environment variables
const baseUrl = 'https://www.mavid.store/api/';
const config = {
    baseUrl,
    timeout: 30000,
};
const api = axios.create(config);
api.defaults.baseURL = baseUrl;

const handleBefore = async (config) => {
    let accessToken = Cookies.get('accessToken')?.replaceAll('"', '');

    if (accessToken) {
        const tokenExpiry = jwtDecode(accessToken).exp * 1000;
        if (Date.now() >= tokenExpiry) {
            try {
                const refreshToken = Cookies.get('refreshToken')?.replaceAll('"', '');
                console.log(refreshToken);

                const response = await axios.post(`${baseUrl}authen/refresh-token`, {
                    refreshToken,
                });
                // console.log(response);
                Cookies.set('accessToken', response.data.data?.accessToken, {
                    expires: 1,
                    secure: true,
                }); // Expires in 7 days
                Cookies.set('refreshToken', response.data.data?.refreshToken, {
                    expires: 7,
                    secure: true,
                });
            } catch (error) {
                console.error('Failed to refresh token:', error);
                return Promise.reject(error);
            }
        }
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
};

const handleError = (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
};

api.interceptors.request.use(handleBefore, handleError);

export default api;
