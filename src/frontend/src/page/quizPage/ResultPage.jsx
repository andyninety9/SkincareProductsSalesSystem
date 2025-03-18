/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Image, Progress } from 'antd';
import Link from 'antd/es/typography/Link';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../config/api';
import { addToCart, increaseQuantity, selectCartItems } from '../../redux/feature/cartSlice';
import Cookies from 'js-cookie';

const { Title, Paragraph } = Typography;

// Component hiển thị một danh mục sản phẩm
const ProductCategorySection = ({ title, products, loading }) => {
    const [showOptions, setShowOptions] = useState(false);
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const userAuth = Cookies.get('user');
    const navigate = useNavigate();

    if (loading) {
        return (
            <Card style={{ marginBottom: '20px', border: 'none' }}>
                <Title level={4}>{title}</Title>
                <Paragraph>Đang tải dữ liệu...</Paragraph>
            </Card>
        );
    }
    const handleCheckLogin = () => {
        if (!userAuth) {
            toast.error('Vui lòng đăng nhập để mua hàng');
            navigate('/login');
            return false;
        }
        return true;
    };
    // In ResultPage.js
    const handleAddToCart = (product) => {
        if (!handleCheckLogin()) return;

        // Default quantity to 1 for each product
        const quantity = 1;

        // Transform productImages into an array of URLs
        const productToAdd = {
            ...product,
            quantity,
            images: product.productImages?.map(img => img.prodImageUrl) || [], // Map to array of URLs
        };

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingProduct = cartItems.find((item) => item.productId === product.productId);

        if (existingProduct) {
            // Nếu sản phẩm đã có trong giỏ hàng, chỉ cập nhật số lượng
            dispatch(increaseQuantity({ productId: product.productId, quantity }));
        } else {
            // Nếu sản phẩm chưa có, thêm sản phẩm mới vào giỏ
            dispatch(addToCart(productToAdd));
        }
        toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    };


    if (!products || products.length === 0) {
        return (
            <Card style={{ marginBottom: '20px', border: 'none' }}>
                <Title level={4}>{title}</Title>
                <Paragraph>Không có sản phẩm được đề xuất cho danh mục này.</Paragraph>
            </Card>
        );
    }

    return (
        <Card style={{ marginBottom: '20px', border: 'none' }}>
            <Title level={4}>{title}</Title>

            {/* Sản phẩm chính được đề xuất */}
            <Row
                align="middle"
                style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    flexWrap: 'nowrap',
                    gap: '20px',
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '20px',
                    marginBottom: '20px',
                }}>
                <Col flex="0 0 180px" style={{ textAlign: 'center' }}>
                    <Image
                        src={products[0].productImages?.[0]?.prodImageUrl || 'https://via.placeholder.com/180'}
                        alt={products[0].productName}
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                </Col>
                <Col flex="1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <Title level={5} style={{ margin: '0 0 10px 0' }}>
                            {products[0].productName}
                        </Title>
                        <Paragraph ellipsis={{ rows: 3 }}>{products[0].productDesc}</Paragraph>
                    </div>
                    <div>
                        <Paragraph
                            style={{ fontWeight: 'bold', color: '#D8959A', fontSize: '16px', margin: '15px 0 10px' }}>
                            Giá: {products[0].sellPrice?.toLocaleString() || 0} VNĐ
                        </Paragraph>
                        <button
                            onClick={() => handleAddToCart(products[0])}
                            style={{
                                backgroundColor: '#D8959A',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'background-color 0.3s',
                                width: '180px',
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = '#c27f85')}
                            onMouseOut={(e) => (e.target.style.backgroundColor = '#D8959A')}>
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </Col>
            </Row>

            {/* Danh sách sản phẩm thay thế với scroll ngang */}
            {products.length > 1 && (
                <div>
                    <Title level={5} style={{ marginBottom: '15px' }}>
                        Sản phẩm tương tự
                    </Title>
                    <div
                        style={{
                            overflowX: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            scrollbarWidth: 'thin',
                            scrollBehavior: 'smooth',
                            padding: '5px 0 15px',
                        }}>
                        <div
                            style={{
                                display: 'flex',
                                gap: '15px',
                                paddingBottom: '5px',
                                minWidth: 'min-content',
                            }}>
                            {products.slice(1).map((product, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        width: '180px',
                                        flex: '0 0 180px',
                                        textAlign: 'center',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        background: '#fff',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '320px',
                                    }}>
                                    <div style={{ flex: '0 0 160px', marginBottom: '10px' }}>
                                        <Image
                                            src={
                                                product.productImages?.[0]?.prodImageUrl ||
                                                'https://via.placeholder.com/160'
                                            }
                                            alt={product.productName}
                                            style={{
                                                width: '100%',
                                                height: '160px',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            flex: '1',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                        }}>
                                        <p
                                            style={{
                                                fontWeight: 'bold',
                                                margin: '0 0 5px 0',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: '2',
                                                WebkitBoxOrient: 'vertical',
                                                lineHeight: '1.3em',
                                                maxHeight: '2.6em',
                                            }}>
                                            {product.productName}
                                        </p>
                                        <div>
                                            <p style={{ fontWeight: 'bold', color: '#D8959A', margin: '10px 0' }}>
                                                {product.sellPrice?.toLocaleString() || 0} VNĐ
                                            </p>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                style={{
                                                    backgroundColor: '#D8959A',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '6px 12px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                    fontSize: '12px',
                                                    width: '100%',
                                                    transition: 'background-color 0.3s',
                                                }}
                                                onMouseOver={(e) => (e.target.style.backgroundColor = '#c27f85')}
                                                onMouseOut={(e) => (e.target.style.backgroundColor = '#D8959A')}>
                                                Thêm vào giỏ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

// Component hiển thị điểm đánh giá da
const SkinScoreDisplay = ({ scores }) => {
    if (!scores) return null;

    const scoreLabels = {
        odscore: { label: 'Độ Khô / Độ Dầu', left: 'Khô', right: 'Dầu' },
        srscore: { label: 'Độ Nhạy Cảm / Khả Năng Chịu Đựng', left: 'Nhạy Cảm', right: 'Chịu Đựng Tốt' },
        pnpscore: { label: 'Không Sắc Tố / Sắc Tố', left: 'Không Sắc Tố', right: 'Nhiều Sắc Tố' },
        wtscore: { label: 'Có Nếp Nhăn / Không Nếp Nhăn', left: 'Nhiều Nếp Nhăn', right: 'Săn Chắc' },
    };

    // Điểm tối đa cho mỗi thông số là 25
    const maxScore = 25;

    return (
        <Card style={{ marginBottom: '20px', border: 'none', backgroundColor: '#F0F8FF' }}>
            <Title level={4}>Điểm Đánh Giá Da Của Bạn</Title>

            <div style={{ padding: '10px 5%' }}>
                {Object.entries(scores).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span>{scoreLabels[key]?.label || key}</span>
                            <span>
                                <strong>
                                    {value}/{maxScore}
                                </strong>
                            </span>
                        </div>
                        <Progress
                            percent={(value / maxScore) * 100}
                            showInfo={false}
                            strokeColor={{
                                '0%': '#FFCC99',
                                '100%': '#E77D3B',
                            }}
                            trailColor="#EAEAEA"
                            strokeWidth={15}
                        />
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '12px',
                                color: '#666',
                            }}>
                            <span>{scoreLabels[key]?.left}</span>
                            <span>{scoreLabels[key]?.right}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const ResultPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const quizData = useSelector((state) => state.quizData);
    const [resultTest, setResultTest] = useState(null);
    const [quizId, setQuizId] = useState(null);

    useEffect(() => {
        const handleGetResult = async (quizId) => {
            try {
                const response = await api.get('/skintest/result', {
                    params: {
                        quizId: quizId,
                    },
                });
                if (response.data.statusCode === 200) {
                    setResultTest(response.data.data);
                    // console.log(response.data.data);
                } else {
                    toast.error('Không thể lấy kết quả kiểm tra da lúc này, vui lòng thử lại sau');
                }
            } catch (error) {
                console.log(error);
                toast.error('Lỗi ở đây');
            }
        };

        if (!quizData || !quizData.questionId) {
            const savedQuiz = JSON.parse(localStorage.getItem('quizData'));
            if (savedQuiz) {
                handleGetResult(savedQuiz.quizId);
            } else {
                toast.error('Không tìm thấy dữ liệu quiz!');
            }
        }
    }, [quizData]);

    return (
        <div style={{ maxWidth: '1440px', margin: '15px auto', padding: '0 10%' }}>
            {/* Loại da Baumann */}
            <Card style={{ marginBottom: '20px', border: 'none' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        gap: '20px',
                    }}>
                    <img
                        src="https://skintypesolutions.com/cdn/shop/articles/img-1690362697700_80992943-e972-417a-bc16-187943ba4712.jpg?v=1692782760"
                        alt="Loại da Baumann"
                        style={{ width: '30%', height: 'auto' }}
                    />
                    <div>
                        <Title level={4} style={{ color: '#E77D3B' }}>
                            Loại da Baumann của bạn là:
                        </Title>
                        <Paragraph style={{ fontSize: '20px' }}>
                            <strong>{resultTest?.skinTypeName || 'Đang tải...'}</strong>
                        </Paragraph>
                        <Paragraph style={{ fontSize: '18px' }}>{resultTest?.skinTypeDesc || ''}</Paragraph>
                    </div>
                </div>
            </Card>

            {/* Hiển thị điểm đánh giá da */}
            <SkinScoreDisplay scores={resultTest?.resultScore} />

            {/* Quy trình chăm sóc */}
            <Card style={{ marginBottom: '20px', backgroundColor: '#F6EEF0' }}>
                <Row style={{ display: 'flex', alignItems: 'center' }}>
                    <Col style={{ textAlign: 'center' }}>
                        <img
                            style={{ width: '100%', maxWidth: '350px', height: 'auto', marginRight: '20px' }}
                            src="https://media.hasaki.vn/hsk/cac-hang-my-pham-noi-tieng-14.jpg"
                            alt="Quy trình chăm sóc da"
                        />
                    </Col>
                    <Col style={{ flex: 1 }}>
                        <Title level={4}>Quy trình chăm sóc da được khuyến nghị:</Title>
                        <Paragraph>{resultTest?.treatmentSolution || 'Đang tải...'}</Paragraph>
                    </Col>
                </Row>
            </Card>

            {/* Quy trình đề xuất */}
            <h3>Quy trình đề xuất</h3>
            <hr style={{ border: '1.5px solid #D8959A', margin: '20px 0', borderRadius: '10px' }} />

            {/* Hiển thị các loại sản phẩm theo danh mục */}
            <div className="product-recommendations">
                {/* 1. Sửa rửa mặt */}
                <ProductCategorySection
                    title="1. Sửa rửa mặt (Cleansers)"
                    products={resultTest?.cleansers}
                    loading={!resultTest}
                />

                {/* 2. Toner */}
                <ProductCategorySection title="2. Toner" products={resultTest?.toners} loading={!resultTest} />

                {/* 3. Dưỡng Ẩm */}
                <ProductCategorySection
                    title="3. Dưỡng Ẩm (Moisturizers)"
                    products={resultTest?.moisturizers}
                    loading={!resultTest}
                />
            </div>
        </div>
    );
};

export default ResultPage;
