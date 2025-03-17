import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import '@fontsource/marko-one';
import Cookies from 'js-cookie';
import api from '../../config/api';
import { toast } from 'react-hot-toast';
import { Layout, Typography, Avatar } from 'antd';
import PropTypes from 'prop-types';
import './ManageOrderHeader.css';

const { Header } = Layout;
const { Text } = Typography;

const ManageOrderHeader = ({ isModalOpen }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const dropdownRef = useRef(null);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await api.get('User/get-me');
            if (response?.data?.statusCode === 200 && response?.data?.data) {
                const data = response.data.data;
                setUserInfo({
                    fullname: data.fullname || '',
                    avatarUrl: data.avatarUrl || '',
                });
                Cookies.set('user', JSON.stringify(data), {
                    expires: 5,
                    secure: true,
                });
            } else {
                console.warn('Unexpected API response:', response);
                setUserInfo({});
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUserInfo({});
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                navigate(routes.login);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [navigate]);

    const fetchLogout = async () => {
        try {
            const response = await api.post('/authen/logout', {
                refreshToken: Cookies.get('refreshToken'),
            });
            if (response.status === 200) {
                toast.success('Logout successfully');
            } else {
                console.error('Logout failed:', response);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('user');
            navigate(routes.home);
        }
    };

    async function handleLogout() {
        await fetchLogout();
    }

    useEffect(() => {
        function updateUserFromCookies() {
            const userCookie = Cookies.get('user');
            try {
                setUser(userCookie ? JSON.parse(userCookie) : null);
            } catch (error) {
                console.error('Failed to parse user cookie:', error);
                setUser(null);
            }
        }

        updateUserFromCookies();
        const cookieCheckInterval = setInterval(updateUserFromCookies, 1000);

        return () => clearInterval(cookieCheckInterval);
    }, []);


    return (
        <Header
            style={{
                background: '#fff',
                padding: '6px 24px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                width: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1050,
                tabIndex: isModalOpen ? '-1' : '0',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                lineHeight: 'normal',
            }}
        >
            <div className="manage-order-container">
                <div className="manage-order-logo-wrapper">
                    <Text
                        style={{
                            fontFamily: 'Marko One, serif',
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: '#000',
                            margin: 0,
                        }}
                    >
                        <Link to={routes.home} className="manage-order-text-dark manage-order-text-decoration-none">
                            Mavid
                        </Link>
                    </Text>
                </div>
                <div className="manage-order-user-wrapper">
                    <div className="manage-order-d-flex manage-order-gap-2 manage-order-align-items-center">
                        {Object.keys(userInfo).length > 0 ? (
                            <div
                                className="manage-order-position-relative"
                                ref={dropdownRef}
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={() => setIsDropdownOpen(false)}
                            >
                                <div className="manage-order-d-flex manage-order-align-items-center">
                                    <Avatar
                                        src={<img src={userInfo.avatarUrl || 'https://via.placeholder.com/40'} alt="avatar" />}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <Text
                                        style={{
                                            marginLeft: '8px',
                                            color: '#A76A6E',
                                            whiteSpace: 'nowrap',
                                            fontFamily: 'Nunito, sans-serif',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {loading ? 'Loading...' : (userInfo.fullname || '')}
                                    </Text>
                                </div>
                                {isDropdownOpen && !loading && (
                                    <div
                                        className="manage-order-position-absolute manage-order-p-2 manage-order-rounded"
                                        style={{
                                            top: '100%',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: '#fffbfc',
                                            padding: '10px',
                                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                            zIndex: 1000,
                                            minWidth: '120px',
                                        }}
                                    >
                                        <Text
                                            className="manage-order-d-block manage-order-text-dark manage-order-text-decoration-none"
                                            style={{ padding: '4px 8px', cursor: 'pointer' }}
                                            onClick={() => navigate(routes.profile)}
                                        >
                                            Profile
                                        </Text>
                                        <Text
                                            className="manage-order-d-block manage-order-text-dark manage-order-text-decoration-none"
                                            style={{ padding: '4px 8px', cursor: 'pointer' }}
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Text>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to={routes.login} className="manage-order-text-dark manage-order-text-decoration-none">
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </Header>
    );
};

ManageOrderHeader.propTypes = {
    isModalOpen: PropTypes.bool,
};

export default ManageOrderHeader;