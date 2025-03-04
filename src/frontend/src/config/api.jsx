import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Get base URL from environment variables
const baseUrl = import.meta.env.BACK_END_BASE_URL || 'https://api-gateway-swp-v1-0-0.onrender.com/api/';
console.log('ENV: ' + import.meta.env.NODE_ENV);
const config = {
    baseUrl,
    timeout: 3000000,
};
const api = axios.create(config);
api.defaults.baseUrl = baseUrl;

const handleBefore = async (config) => {
    let accessToken = Cookies.get('accessToken')?.replaceAll('"', '');

    if (accessToken) {
        const tokenExpiry = jwtDecode(accessToken).exp * 1000;
        if (Date.now() >= tokenExpiry) {
            try {
                const refreshToken = Cookies.get('refreshToken');
                const encodedRefreshToken = encodeURIComponent(refreshToken);
                // const response = await axios.post(
                //     `https://localhost:5001/api/Authentication/refresh-token?refreshToken=${encodedRefreshToken}`
                // );
                const response = await axios.post(`${baseUrl}authen/refresh-token`, {
                    refreshToken: refreshToken,
                });
                // console.log(response);
                accessToken = response.data.token;
                Cookies.set('accessToken', response.data?.token, {
                    expires: 7,
                    secure: true,
                }); // Expires in 7 days
                Cookies.set('refreshToken', response.data?.refreshToken, {
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
