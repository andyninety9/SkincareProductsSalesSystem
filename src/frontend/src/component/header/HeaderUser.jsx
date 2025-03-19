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
import { Avatar, Badge, Dropdown } from 'antd';
import LiveSearchProduct from '../liveSearchProduct/liveSearchProduct';

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
    const [categories, setCategories] = useState([]); // State lưu danh sách categories


    useEffect(() => {
        // Explicitly bind prevUserCookieRef to avoid scope issues
        function updateUserFromCookies() {
            const userCookie = Cookies.get('user');
            // Only update if the cookie has changed
            if (userCookie !== prevUserCookieRef.current) {
                prevUserCookieRef.current = userCookie;
                try {
                    setUser(userCookie ? JSON.parse(userCookie) : null);
                } catch (error) {
                    // console.error('failed to parse user', error);
                    setUser(null);
                }
            }
        }

        // Initial update
        updateUserFromCookies();

        // Check for cookie changes periodically
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
                // console.log('Logout success:', response);
            } else {
                console.error('Logout failed:', response);
            }
        } catch (error) {
            // toast.error('Error logging out');
            // console.error('Error:', error);
        } finally {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('user');
            // Clear the cart state in Redux
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
                                <Avatar src={<img src={user.avatarUrl} alt="avatar" />} style={{ cursor: 'pointer' }} />
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

                    <FaHeart className="fs-5 text-secondary cursor-pointer" />
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
                        <div className="position-absolute p-4 rounded" style={{ background: '#fffbfc', zIndex: 1000 }}>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="row ps-5">
                                        <div className="col-md-4" style={{  fontSize: '17px' }}>
                                            <h6 className="fw-bold mt-2">Danh mục sản phẩm</h6>
                                            {categories.map((category) => (
                                                <Link
                                                    key={category.cateProdId}
                                                    to={`/products/category/${category.cateProdId}`}
                                                    className="text-dark text-decoration-none d-block">
                                                    {category.cateProdName}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Image */}
                                {/* <div className="col-md-4 d-flex align-items-center justify-content-center">
                                    <img src={dropdownImage} alt="Dropdown" className="img-fluid rounded" style={{ maxWidth: '300px' }} />
                                </div> */}
                            </div>
                        </div>
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
