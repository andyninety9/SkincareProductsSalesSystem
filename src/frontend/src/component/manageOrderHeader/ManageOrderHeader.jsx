// src/component/manageOrderHeader/ManageOrderHeader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../../routes'; // Adjust the import path as needed
import '@fontsource/marko-one';
import Cookies from 'js-cookie';
import api from '../../config/api';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/feature/cartSlice'; // Adjust Redux paths as needed
import { resetQuiz } from '../../redux/feature/quizSlice'; // Adjust Redux paths as needed
import { Layout, Typography, Avatar } from 'antd';
import PropTypes from 'prop-types'; // For PropTypes validation
import './ManageOrderHeader.css'; // Ensure CSS file is imported

const { Header } = Layout;
const { Text } = Typography;

const ManageOrderHeader = ({ isModalOpen }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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
            dispatch(clearCart());
            dispatch(resetQuiz());
            navigate(routes.home);
        }
    };

    async function handleLogout() {
        await fetchLogout();
    }

    return (
        <Header
            style={{
                background: '#fff',
                padding: '6px 24px', // Reduced from 12px to 6px
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                width: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1050,
                tabIndex: isModalOpen ? '-1' : '0',
                height: '60px', // Explicitly set a smaller height
                display: 'flex',
                alignItems: 'center',
                lineHeight: 'normal' // Override Ant Design's default line height
            }}
        >
            <div className="container d-flex justify-content-between align-items-center">
                <Text
                    style={{
                        fontFamily: 'Marko One, serif',
                        fontSize: '32px', // Reduced font size
                        fontWeight: 'bold',
                        color: '#000',
                        margin: 0,
                    }}
                >
                    <Link to={routes.home} className="text-dark text-decoration-none">
                        Mavid
                    </Link>
                </Text>

                <div className="d-flex gap-2 align-items-center">
                    {user ? (
                        <div
                            className="position-relative"
                            ref={dropdownRef}
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <div className="d-flex align-items-center">
                                <Avatar
                                    src={<img src={user.avatarUrl || 'https://via.placeholder.com/40'} alt="avatar" />}
                                    style={{ cursor: 'pointer' }}
                                />
                                <Text style={{ marginLeft: '8px', color: '#000', whiteSpace: 'nowrap' }}>
                                    {user.fullName || 'User'}
                                </Text>
                            </div>
                            {isDropdownOpen && (
                                <div
                                    className="position-absolute p-2 rounded"
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
                                        className="d-block text-dark text-decoration-none"
                                        style={{ padding: '4px 8px', cursor: 'pointer' }}
                                        onClick={() => navigate(routes.profile)}
                                    >
                                        Profile
                                    </Text>
                                    <Text
                                        className="d-block text-dark text-decoration-none"
                                        style={{ padding: '4px 8px', cursor: 'pointer' }}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Text>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to={routes.login} className="text-dark text-decoration-none">
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </Header>
    );
};

// Add PropTypes validation
ManageOrderHeader.propTypes = {
    isModalOpen: PropTypes.bool,
};

export default ManageOrderHeader;