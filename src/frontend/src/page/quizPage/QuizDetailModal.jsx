/* eslint-disable react/prop-types */
import React from 'react';
import { Modal, Typography, Divider, Row, Col, Card, Progress, Image, Spin, Empty } from 'antd';
import { CalendarOutlined, SkinOutlined, InfoCircleOutlined } from '@ant-design/icons';
import CardProduct from '../../component/cardProduct/card';

const { Title, Paragraph, Text } = Typography;

const QuizDetailModal = ({ visible, onClose, quizData, loading }) => {
    if (!quizData && !loading) {
        return (
            <Modal open={visible} onCancel={onClose} footer={null} width={800} centered>
                <Empty description="Không tìm thấy dữ liệu kiểm tra" />
            </Modal>
        );
    }

    // Render skin scores with Progress bars
    const renderSkinScores = () => {
        if (!quizData || !quizData.resultScore) return null;

        const scoreLabels = {
            odscore: { label: 'Độ Khô / Độ Dầu', left: 'Khô', right: 'Dầu' },
            srscore: { label: 'Độ Nhạy Cảm / Khả Năng Chịu Đựng', left: 'Nhạy Cảm', right: 'Chịu Đựng Tốt' },
            pnpscore: { label: 'Không Sắc Tố / Sắc Tố', left: 'Không Sắc Tố', right: 'Nhiều Sắc Tố' },
            wtscore: { label: 'Có Nếp Nhăn / Không Nếp Nhăn', left: 'Nhiều Nếp Nhăn', right: 'Săn Chắc' },
        };

        // Điểm tối đa cho mỗi thông số là 25
        const maxScore = 25;

        return (
            <Card className="skin-score-card">
                <Title level={4}>Điểm Đánh Giá Da</Title>
                <div style={{ padding: '10px 0' }}>
                    {Object.entries(quizData.resultScore).map(([key, value]) => (
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

    // Render product section for a category
    const renderProductSection = (title, products) => {
        if (!products || products.length === 0) return null;

        return (
            <div style={{ marginBottom: '20px' }}>
                <Title level={5}>{title}</Title>
                <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '10px' }}>
                    {products.map((product) => (
                        // <Card
                        //     key={product.productId}
                        //     hoverable
                        //     style={{ width: 160, flexShrink: 0 }}
                        //     cover={
                        //         <Image
                        //             alt={product.productName}
                        //             src={product.productImages?.[0]?.prodImageUrl || 'https://via.placeholder.com/160'}
                        //             style={{ height: 160, objectFit: 'cover' }}
                        //         />
                        //     }>
                        //     <Card.Meta
                        //         title={product.productName}
                        //         description={
                        //             <Text type="secondary" ellipsis={{ rows: 2 }}>
                        //                 {product.productDesc}
                        //             </Text>
                        //         }
                        //     />
                        //     <div style={{ marginTop: 10 }}>
                        //         <Text strong style={{ color: '#D8959A' }}>
                        //             {product.sellPrice?.toLocaleString() || 0} VNĐ
                        //         </Text>
                        //     </div>
                        // </Card>
                        <div key={product.productId} style={{ width: 200, flexShrink: 0 }}>
                        <CardProduct product={product} isInModal />
                    </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            centered
            bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SkinOutlined style={{ fontSize: '20px', marginRight: '10px', color: '#D8959A' }} />
                    <span>Chi tiết kết quả kiểm tra da</span>
                </div>
            }>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                    <p style={{ marginTop: 20 }}>Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="quiz-detail-content">
                    <div className="quiz-meta">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Text type="secondary">
                                    Mã bài kiểm tra: <Text strong>{quizData?.quizId}</Text>
                                </Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text type="secondary">
                                    <CalendarOutlined style={{ marginRight: 5 }} />
                                    Ngày tạo:{' '}
                                    <Text strong>{new Date(quizData?.createAt).toLocaleDateString('vi-VN')}</Text>
                                </Text>
                            </Col>
                        </Row>
                    </div>

                    <Divider />

                    {/* Skin Type Section */}
                    <div className="skin-type-section">
                        <Title level={4} style={{ color: '#E77D3B' }}>
                            Loại da Baumann của bạn
                        </Title>
                        <Card>
                            <Row gutter={16} align="middle">
                                <Col xs={24} md={8}>
                                    <Image
                                        src="https://skintypesolutions.com/cdn/shop/articles/img-1690362697700_80992943-e972-417a-bc16-187943ba4712.jpg?v=1692782760"
                                        alt="Baumann Skin Type"
                                        width="100%"
                                    />
                                </Col>
                                <Col xs={24} md={16}>
                                    <Title level={4}>{quizData?.skinTypeName || 'Không có dữ liệu'}</Title>
                                    <Paragraph>
                                        <Text>{quizData?.skinTypeCode}</Text>
                                    </Paragraph>
                                    <Paragraph>{quizData?.skinTypeDesc}</Paragraph>
                                </Col>
                            </Row>
                        </Card>
                    </div>

                    {/* Skin Scores Section */}
                    {renderSkinScores()}

                    {/* Treatment Section */}
                    <Card style={{ marginTop: 20, backgroundColor: '#F6EEF0' }}>
                        <Title level={4}>
                            <InfoCircleOutlined style={{ marginRight: 8 }} />
                            Quy trình chăm sóc da được khuyến nghị
                        </Title>
                        <Paragraph>{quizData?.treatmentSolution}</Paragraph>
                    </Card>

                    {/* Product Recommendations */}
                    <div className="product-recommendations" style={{ marginTop: 20 }}>
                        <Title level={4}>Sản phẩm được đề xuất</Title>

                        {renderProductSection('1. Sửa rửa mặt (Cleansers)', quizData?.cleansers)}
                        {renderProductSection('2. Toner', quizData?.toners)}
                        {renderProductSection('3. Dưỡng Ẩm (Moisturizers)', quizData?.moisturizers)}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default QuizDetailModal;
