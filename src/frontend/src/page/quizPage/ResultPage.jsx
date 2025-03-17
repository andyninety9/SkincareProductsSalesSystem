/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Image, Progress } from 'antd';
import Link from 'antd/es/typography/Link';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../config/api';

const { Title, Paragraph } = Typography;

// Component hiển thị một danh mục sản phẩm
const ProductCategorySection = ({ title, products, loading }) => {
    const [showOptions, setShowOptions] = useState(false);

    if (loading) {
        return (
            <Card style={{ marginBottom: '20px', border: 'none' }}>
                <Title level={4}>{title}</Title>
                <Paragraph>Đang tải dữ liệu...</Paragraph>
            </Card>
        );
    }

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
            <Row align="middle" style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: '10px' }}>
                <Col flex="0 0 150px" style={{ textAlign: 'center' }}>
                    <Image
                        src={products[0].productImages?.[0]?.prodImageUrl || 'https://via.placeholder.com/150'}
                        alt={products[0].productName}
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                    {products.length > 1 && (
                        <Link
                            style={{
                                color: 'black',
                                textDecoration: 'underline',
                                marginTop: '10px',
                                display: 'block',
                                cursor: 'pointer',
                            }}
                            onClick={() => setShowOptions(!showOptions)}>
                            {showOptions ? 'Ẩn các tùy chọn khác' : 'Tùy chọn khác'}
                        </Link>
                    )}
                </Col>
                <Col flex="1">
                    <Title level={5}>{products[0].productName}</Title>
                    <Paragraph>{products[0].productDesc}</Paragraph>
                    <Paragraph style={{ fontWeight: 'bold', color: '#D8959A' }}>
                        Giá: {products[0].sellPrice?.toLocaleString() || 0} VNĐ
                    </Paragraph>
                </Col>
            </Row>

            {/* Danh sách sản phẩm thay thế */}
            {products.length > 1 && (
                <div
                    style={{
                        display: showOptions ? 'flex' : 'none',
                        gap: '10px',
                        marginTop: '20px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        opacity: showOptions ? 1 : 0,
                        transform: showOptions ? 'translateY(0)' : 'translateY(-20px)',
                        transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                    }}>
                    {products.slice(1).map((product, idx) => (
                        <div
                            key={idx}
                            style={{
                                width: '150px',
                                textAlign: 'center',
                                border: '1px solid #ddd',
                                padding: '10px',
                                borderRadius: '5px',
                                background: '#fff',
                            }}>
                            <Image
                                src={product.productImages?.[0]?.prodImageUrl || 'https://via.placeholder.com/150'}
                                alt={product.productName}
                                style={{ maxWidth: '100%' }}
                            />
                            <p style={{ marginTop: '5px', fontWeight: 'bold' }}>{product.productName}</p>
                            <p>{product.sellPrice?.toLocaleString() || 0} VNĐ</p>
                        </div>
                    ))}
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
