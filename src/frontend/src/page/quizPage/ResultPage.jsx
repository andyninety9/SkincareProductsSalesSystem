import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Image } from 'antd';
import Link from 'antd/es/typography/Link';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../config/api';

const { Title, Paragraph } = Typography;

const ResultPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const quizData = useSelector((state) => state.quizData);
    const [showOptions, setShowOptions] = useState(false);
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
                    console.log(response.data.data);
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

            {/* Hiển thị danh sách sản phẩm từ API */}
            {resultTest?.cleansers.length > 0 && (
                <Card style={{ border: 'none' }}>
                    {resultTest.cleansers.map((product, index) => (
                        <Row
                            key={index}
                            align="middle"
                            style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: '10px' }}>
                            <Col flex="0 0 150px" style={{ textAlign: 'center' }}>
                                <Image
                                    src={product.productImages?.[0]?.prodImageUrl || 'https://via.placeholder.com/150'}
                                    alt={product.productName}
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
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
                            </Col>
                            <Col flex="1">
                                <Title level={5}>{product.productName}</Title>
                                <Paragraph>{product.productDesc}</Paragraph>
                                <Paragraph style={{ fontWeight: 'bold', color: '#D8959A' }}>
                                    Giá: {product.sellPrice.toLocaleString()} VNĐ
                                </Paragraph>
                            </Col>
                        </Row>
                    ))}

                    {/* Danh sách sản phẩm thay thế */}
                    <div
                        style={{
                            display: showOptions ? 'flex' : 'none',
                            gap: '10px',
                            marginTop: '10px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            opacity: showOptions ? 1 : 0,
                            transform: showOptions ? 'translateY(0)' : 'translateY(-20px)',
                            transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                        }}>
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                style={{
                                    width: '150px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    background: '#fff',
                                }}>
                                <Image
                                    src="https://www.lottemart.vn/media/catalog/product/cache/0x0/3/4/3499320013185-1.jpg.webp"
                                    alt={`Sản phẩm ${item}`}
                                    style={{ maxWidth: '100%' }}
                                />
                                <p style={{ marginTop: '5px', fontWeight: 'bold' }}>Tên sản phẩm</p>
                                <p>200.000 VNĐ</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ResultPage;
