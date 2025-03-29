import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaSearch, FaShoppingBag } from 'react-icons/fa';
import { routes } from '../../routes';
import dropdownImage from '../../assets/dropdown.webp';
import './HeaderUser.css';
import '@fontsource/marko-one';
import Cookies from 'js-cookie';
import api from '../../config/api';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, selectCartItems } from '../../redux/feature/cartSlice';
import { resetQuiz } from '../../redux/feature/quizSlice';
import { Avatar, Badge, Card, Divider, Dropdown, Menu, Space, Typography } from 'antd';
import LiveSearchProduct from '../liveSearchProduct/liveSearchProduct';
import { AppstoreOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';

const HeaderUser = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const cartItems = useSelector(selectCartItems);
    const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const searchRef = useRef(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [user, setUser] = useState(null);
    const prevUserCookieRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [skinTypes, setSkinTypes] = useState([]);

    useEffect(() => {
        function updateUserFromCookies() {
            const userCookie = Cookies.get('user');
            if (userCookie !== prevUserCookieRef.current) {
                prevUserCookieRef.current = userCookie;
                try {
                    setUser(userCookie ? JSON.parse(userCookie) : null);
                } catch (error) {
                    setUser(null);
                }
            }
        }

        updateUserFromCookies();

        const cookieCheckInterval = setInterval(updateUserFromCookies, 1000);

        return () => clearInterval(cookieCheckInterval);
    }, []);
    const items = [
        {
            key: '1',
            icon: <>Xem hồ sơ</>,
            text: 'Profile',
            onClick: () => navigate(routes.profile),
        },
        {
            key: '2',
            icon: <>Kết quả kiểm tra da</>,
            text: 'History',
            onClick: () => navigate(routes.resultQuizHistory),
        },
        {
            key: '3',
            icon: <>Đăng xuất</>,
            text: 'Logout',
            onClick: handleLogout,
        },
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        }

        if (isSearchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchOpen]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('Products/categories?page=1&pageSize=1000');
                if (response.status === 200) {
                    setCategories(response.data.data.items);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
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
        console.log('RefreshToken: ', Cookies.get('refreshToken'));
        await fetchLogout();
    }

    const handleShowSearchbar = () => {
        if (isSearchOpen) {
            setIsSearchOpen(false);
        } else {
            setIsSearchOpen(true);
            setTimeout(() => {
                const searchInput = document.querySelector('.search-overlay input');
                if (searchInput) searchInput.focus();
            }, 100);
        }
    };

    return (
        <header className="border-bottom">
            <div className="text-center text-white py-2 small" style={{ backgroundColor: '#D8959A' }}>
                Giao hàng toàn quốc với chỉ 30.000đ
            </div>

            {/* Header Content */}
            <div className="container d-flex justify-content-between align-items-center py-3">
                <div className="d-flex" style={{ flex: 1 }}></div>

                {/* Logo (Navigates to Home) */}
                <h1 className="fw-bold m-0 text-center" style={{ fontFamily: 'Marko One', fontSize: '2rem' }}>
                    <Link to={routes.home} className="text-dark text-decoration-none">
                        Mavid
                    </Link>
                </h1>

                {/* Icons */}
                <div className="d-flex gap-3 align-items-center justify-content-end" style={{ flex: 1 }}>
                    {user ? (
                        <>
                            <Dropdown
                                menu={{
                                    items,
                                }}>
                                <Avatar
                                    src={
                                        user.avatarUrl ||
                                        'https://cloud.appwrite.io/v1/storage/buckets/67dbb6420032d8a2ee8f/files/67dbcb3d26027f2e8bc1/view?project=67dbb339000bfac45e0d'
                                    }
                                    style={{ cursor: 'pointer' }}
                                    onError={() => {
                                        return true;
                                    }}
                                />
                            </Dropdown>
                        </>
                    ) : (
                        <>
                            {' '}
                            <Link to={routes.login} className="text-dark text-decoration-none">
                                Đăng nhập
                            </Link>
                        </>
                    )}

                    <FaSearch
                        className={`fs-5 cursor-pointer ${isSearchOpen ? 'text-dark' : 'text-secondary'}`}
                        onClick={handleShowSearchbar}
                        aria-label="Search products"
                    />

                    <Badge count={totalCartItems} showZero>
                        <FaShoppingBag
                            style={{ cursor: 'pointer' }}
                            className="fs-5 text-secondary cursor-pointer"
                            onClick={() => navigate(routes.cart)}
                        />
                    </Badge>
                </div>
            </div>

            {/* Navigation */}
            <nav className="container d-flex justify-content-center align-items-center gap-4 pb-3 flex-nowrap">
                <Link to={routes.home} className="text-dark text-decoration-none" style={{ whiteSpace: 'nowrap' }}>
                    Trang chủ
                </Link>
                <div
                    style={{ whiteSpace: 'nowrap', width: 'fit-content' }}
                    className="position-relative"
                    ref={dropdownRef}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}>
                    <span className="text-dark text-decoration-none cursor-pointer black-sparkle">
                        <Link to={routes.product} className="text-dark text-decoration-none">
                            Sản phẩm
                        </Link>
                    </span>

                    {isDropdownOpen && categories.length > 0 && (
                        <Card
                            className="position-absolute"
                            style={{
                                width: 550,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                zIndex: 1000,
                                border: '1px solid #f0f0f0',
                            }}
                            bodyStyle={{ padding: '16px' }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Typography.Title
                                        level={5}
                                        style={{ padding: '0 0 8px', borderBottom: '1px solid #f0f0f0', margin: 0 }}>
                                        <Space>
                                            <AppstoreOutlined />
                                            Danh mục sản phẩm
                                        </Space>
                                    </Typography.Title>
                                    <Menu style={{ border: 'none' }}>
                                        {categories.map((category) => (
                                            <Menu.Item
                                                key={`cat-${category.cateProdId}`}
                                                onClick={() => navigate(`/product?cateProdId=${category.cateProdId}`)}
                                                style={{
                                                    padding: '8px',
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'center',
                                                }}>
                                                {category.cateProdName}
                                            </Menu.Item>
                                        ))}
                                    </Menu>
                                </Col>
                            </Row>
                        </Card>
                    )}
                </div>
                <Link to="/promotions" className="text-dark text-decoration-none" style={{ whiteSpace: 'nowrap' }}>
                    Khuyến mãi
                </Link>
                <Link to={routes.about} className="text-dark text-decoration-none" style={{ whiteSpace: 'nowrap' }}>
                    Về chúng tôi
                </Link>
                {user && (user.role === 'Manager' || user.role === 'Staff') && (
                    <Link
                        to="/manage-account"
                        className="text-dark text-decoration-none"
                        style={{ whiteSpace: 'nowrap' }}>
                        Dashboard
                    </Link>
                )}
                {user && user.role === 'Customer' && (
                    <span
                        className="text-dark text-decoration-none cursor-pointer"
                        style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}
                        onClick={() => {
                            if (user) {
                                navigate(routes.startQuiz);
                            } else {
                                toast.error('Vui lòng đăng nhập để kiểm tra loại da!');
                                navigate(routes.login);
                            }
                        }}>
                        Kiểm tra loại da của bạn
                    </span>
                )}
            </nav>
            {isSearchOpen && (
                <div ref={searchRef} className="search-overlay">
                    <LiveSearchProduct onClose={() => setIsSearchOpen(false)} autoFocus={true} />
                </div>
            )}
        </header>
    );
};

export default HeaderUser;
