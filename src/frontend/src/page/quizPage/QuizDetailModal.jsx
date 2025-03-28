/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react';
import {
    Modal,
    Typography,
    Divider,
    Row,
    Col,
    Card,
    Progress,
    Image,
    Spin,
    Empty,
    Tag,
    message,
    Button,
    Input,
} from 'antd';
import {
    CalendarOutlined,
    SkinOutlined,
    InfoCircleOutlined,
    DownloadOutlined,
    EditOutlined,
    SaveOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import html2canvas from '../../../node_modules/html2canvas/dist/html2canvas.esm';
const { Title, Paragraph, Text } = Typography;
import { saveAs } from 'file-saver';

const QuizDetailModal = ({ visible, onClose, quizData, loading }) => {
    const exportContentRef = useRef(null);
    const fullContentRef = useRef(null);
    const navigate = useNavigate();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [fileName, setFileName] = useState('');
    const [generatingImage, setGeneratingImage] = useState(false);

    if (!quizData && !loading) {
        return (
            <Modal open={visible} onCancel={onClose} footer={null} width={800} centered>
                <Empty description="Không tìm thấy dữ liệu kiểm tra" />
            </Modal>
        );
    }

    const exportToImage = async () => {
        if (!exportContentRef.current) return;

        try {
            setGeneratingImage(true);
            const messageKey = 'generatingImage';
            message.loading({ content: 'Đang tạo hình ảnh...', key: messageKey });

            // Tạo một container tạm thời để styling không ảnh hưởng đến DOM gốc
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.width = '800px';
            tempContainer.style.backgroundColor = '#ffffff';
            tempContainer.style.padding = '20px';
            tempContainer.innerHTML = exportContentRef.current.innerHTML;
            document.body.appendChild(tempContainer);

            // Đảm bảo tất cả các ảnh được tải đầy đủ
            await Promise.all(
                Array.from(tempContainer.querySelectorAll('img'))
                    .filter((img) => !img.complete)
                    .map(
                        (img) =>
                            new Promise((resolve) => {
                                img.onload = img.onerror = resolve;
                            })
                    )
            );

            // Fix styling cho container tạm thời
            const headings = tempContainer.querySelectorAll('h1, h2, h3, h4, h5');
            headings.forEach((h) => {
                h.style.margin = '15px 0';
                h.style.lineHeight = '1.4';
            });

            const paragraphs = tempContainer.querySelectorAll('p');
            paragraphs.forEach((p) => {
                p.style.margin = '10px 0';
                p.style.lineHeight = '1.6';
            });

            const cards = tempContainer.querySelectorAll('.ant-card');
            cards.forEach((card) => {
                card.style.marginBottom = '20px';
                card.style.borderRadius = '8px';
                card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            });

            const canvas = await html2canvas(tempContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                windowWidth: 800,
            });

            // Xóa container tạm
            document.body.removeChild(tempContainer);

            const image = canvas.toDataURL('image/png');
            setPreviewImage(image);
            setFileName(`KetQuaKiemTraDa_${quizData?.skinTypeCode || 'Result'}`);

            message.destroy(messageKey);
            setGeneratingImage(false);
            setPreviewVisible(true);
        } catch (error) {
            console.error('Lỗi khi tạo hình ảnh:', error);
            message.error('Không thể tạo hình ảnh, vui lòng thử lại.');
            setGeneratingImage(false);
        }
    };

    const handleSaveImage = () => {
        if (!previewImage) {
            message.error('Không có hình ảnh để lưu.');
            return;
        }

        try {
            // Tạo blob từ base64
            const byteString = atob(previewImage.split(',')[1]);
            const mimeString = previewImage.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);

            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([ab], { type: mimeString });
            saveAs(blob, `${fileName || 'KetQuaKiemTraDa'}.png`);

            setPreviewVisible(false);
            message.success('Đã lưu kết quả thành công!');
        } catch (error) {
            console.error('Lỗi khi lưu hình ảnh:', error);
            message.error('Không thể lưu kết quả, vui lòng thử lại.');
        }
    };

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
                        <Card
                            key={product.productId}
                            hoverable
                            style={{ width: 200, flexShrink: 0 }}
                            onClick={() => navigate(`/product/${product.productId}`)}
                            cover={
                                <Image
                                    alt={product.productName}
                                    src={product.productImages?.[0]?.prodImageUrl || 'https://via.placeholder.com/160'}
                                    style={{ height: 200, objectFit: 'cover' }}
                                />
                            }>
                            <Card.Meta
                                title={product.productName}
                                description={
                                    <Text type="secondary" ellipsis={{ rows: 2 }}>
                                        {product.productDesc}
                                    </Text>
                                }
                            />
                            <div style={{ marginTop: 10 }}>
                                <Text strong style={{ color: '#D8959A' }}>
                                    {product.sellPrice?.toLocaleString() || 0} VNĐ
                                </Text>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <Modal
                open={visible}
                onCancel={onClose}
                footer={[
                    <Button key="close" onClick={onClose}>
                        Đóng
                    </Button>,
                    <Button
                        key="download"
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={exportToImage}
                        loading={generatingImage}
                        style={{ backgroundColor: '#D8959A', borderColor: '#D8959A' }}
                        disabled={loading}>
                        Lưu kết quả
                    </Button>,
                ]}
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
                    <div className="quiz-detail-content" ref={fullContentRef}>
                        <div className="exportable-content" ref={exportContentRef}>
                            {/* 1. Thông tin kiểm tra */}
                            <div className="quiz-meta" style={{ marginBottom: '20px' }}>
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
                                            <Text strong>
                                                {new Date(quizData?.createAt).toLocaleDateString('vi-VN')}
                                            </Text>
                                        </Text>
                                    </Col>
                                </Row>
                            </div>

                            <Divider style={{ margin: '15px 0' }} />

                            {/* 2. Loại da Baumann */}
                            <div className="skin-type-section">
                                <Title level={4} style={{ color: '#E77D3B', marginBottom: '15px' }}>
                                    Loại da Baumann của bạn
                                </Title>
                                <Card
                                    className="skin-type-card"
                                    style={{
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        overflow: 'hidden',
                                        border: '1px solid #F0E6E8',
                                        marginBottom: '20px',
                                    }}>
                                    <Row gutter={[16, 16]} align="middle">
                                        <Col xs={24} md={8}>
                                            <div style={{ textAlign: 'center' }}>
                                                <Image
                                                    src="https://static.wixstatic.com/media/a64899_5eb5c4abcbea4ab2ae3429338fdcc367~mv2.png/v1/fill/w_568,h_568,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/a64899_5eb5c4abcbea4ab2ae3429338fdcc367~mv2.png"
                                                    alt="Baumann Skin Type"
                                                    width="100%"
                                                    style={{ maxWidth: '200px', borderRadius: '6px' }}
                                                    preview={false}
                                                />
                                            </div>
                                        </Col>
                                        <Col xs={24} md={16}>
                                            <div style={{ padding: '8px 0' }}>
                                                <div style={{ marginBottom: '12px' }}>
                                                    <Title
                                                        level={4}
                                                        style={{
                                                            margin: '0 0 8px 0',
                                                            color: '#333',
                                                            fontWeight: 600,
                                                        }}>
                                                        {quizData?.skinTypeName || 'Không có dữ liệu'}
                                                    </Title>
                                                    <Tag
                                                        color="#E77D3B"
                                                        style={{
                                                            fontSize: '16px',
                                                            padding: '4px 12px',
                                                            borderRadius: '4px',
                                                            fontWeight: 'bold',
                                                            boxShadow: '0 2px 0 rgba(231, 125, 59, 0.1)',
                                                        }}>
                                                        {quizData?.skinTypeCode}
                                                    </Tag>
                                                </div>
                                                <div
                                                    style={{
                                                        padding: '12px 16px',
                                                        backgroundColor: '#FFF9F6',
                                                        borderRadius: '6px',
                                                        border: '1px solid #FFE8D9',
                                                        marginTop: '10px',
                                                    }}>
                                                    <Paragraph
                                                        style={{
                                                            fontSize: '15px',
                                                            lineHeight: '1.6',
                                                            margin: 0,
                                                            color: '#555',
                                                        }}>
                                                        {quizData?.skinTypeDesc}
                                                    </Paragraph>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </div>

                            {/* 3. Điểm đánh giá da */}
                            <div style={{ marginBottom: '20px' }}>
                                <Card className="skin-score-card" style={{ marginBottom: '20px' }}>
                                    <Title level={4} style={{ marginBottom: '15px' }}>
                                        Điểm Đánh Giá Da
                                    </Title>
                                    <div style={{ padding: '10px 0' }}>
                                        {Object.entries(quizData?.resultScore || {}).map(([key, value]) => {
                                            const scoreLabels = {
                                                odscore: { label: 'Độ Khô / Độ Dầu', left: 'Khô', right: 'Dầu' },
                                                srscore: {
                                                    label: 'Độ Nhạy Cảm / Khả Năng Chịu Đựng',
                                                    left: 'Nhạy Cảm',
                                                    right: 'Chịu Đựng Tốt',
                                                },
                                                pnpscore: {
                                                    label: 'Không Sắc Tố / Sắc Tố',
                                                    left: 'Không Sắc Tố',
                                                    right: 'Nhiều Sắc Tố',
                                                },
                                                wtscore: {
                                                    label: 'Có Nếp Nhăn / Không Nếp Nhăn',
                                                    left: 'Nhiều Nếp Nhăn',
                                                    right: 'Săn Chắc',
                                                },
                                            };
                                            const maxScore = 25;

                                            return (
                                                <div key={key} style={{ marginBottom: '20px' }}>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            marginBottom: '5px',
                                                            flexWrap: 'nowrap',
                                                        }}>
                                                        <span style={{ flex: '1' }}>
                                                            {scoreLabels[key]?.label || key}
                                                        </span>
                                                        <span style={{ minWidth: '50px', textAlign: 'right' }}>
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
                                                            marginTop: '4px',
                                                        }}>
                                                        <span>{scoreLabels[key]?.left}</span>
                                                        <span>{scoreLabels[key]?.right}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>
                            </div>

                            {/* 4. Quy trình chăm sóc da đề xuất */}
                            <Card
                                style={{
                                    backgroundColor: '#F9F2F4',
                                    marginBottom: '20px',
                                    borderRadius: '8px',
                                }}>
                                <Title level={4} style={{ color: '#D8959A', marginTop: '0' }}>
                                    Quy trình chăm sóc da được đề xuất
                                </Title>
                                <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                                    {quizData?.treatmentSolution}
                                </Paragraph>
                                <Divider style={{ margin: '16px 0' }} />
                                <Paragraph style={{ fontSize: '15px', marginBottom: '10px' }}>
                                    Dựa trên kết quả phân tích loại da{' '}
                                    <Tag color="#E77D3B">{quizData?.skinTypeCode}</Tag> của bạn, chúng tôi đề xuất quy
                                    trình 3 bước cơ bản sau đây để đạt được làn da khỏe mạnh.
                                </Paragraph>

                                {/* Quy trình chăm sóc 3 bước */}
                                <div style={{ marginTop: '15px' }}>
                                    {/* Bước 1 */}
                                    <div
                                        style={{
                                            backgroundColor: '#F1F8F6',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            borderLeft: '4px solid #7EBEB2',
                                            marginBottom: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}>
                                        <div
                                            style={{
                                                backgroundColor: '#7EBEB2',
                                                color: 'white',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginRight: '10px',
                                                fontWeight: 'bold',
                                            }}>
                                            1
                                        </div>
                                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                            Sửa rửa mặt (Cleansers)
                                        </span>
                                    </div>

                                    {/* Bước 2 */}
                                    <div
                                        style={{
                                            backgroundColor: '#F3F2F8',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            borderLeft: '4px solid #9E94CC',
                                            marginBottom: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginTop: '15px',
                                        }}>
                                        <div
                                            style={{
                                                backgroundColor: '#9E94CC',
                                                color: 'white',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginRight: '10px',
                                                fontWeight: 'bold',
                                            }}>
                                            2
                                        </div>
                                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Toner</span>
                                    </div>

                                    {/* Bước 3 */}
                                    <div
                                        style={{
                                            backgroundColor: '#FFF4F4',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            borderLeft: '4px solid #D8959A',
                                            marginBottom: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginTop: '15px',
                                        }}>
                                        <div
                                            style={{
                                                backgroundColor: '#D8959A',
                                                color: 'white',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginRight: '10px',
                                                fontWeight: 'bold',
                                            }}>
                                            3
                                        </div>
                                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                            Dưỡng Ẩm (Moisturizers)
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <Divider style={{ margin: '24px 0' }} />
                        {/* Product Recommendations */}
                        <div className="product-recommendations" style={{ marginTop: 20 }}>
                            <Card style={{ backgroundColor: '#F9F2F4', marginBottom: 20 }}>
                                <Title level={4} style={{ color: '#D8959A' }}>
                                    Quy trình chăm sóc da được đề xuất
                                </Title>
                                <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                                    {quizData?.treatmentSolution}
                                </Paragraph>
                                <Divider style={{ margin: '16px 0' }} />
                                <Paragraph style={{ fontSize: '15px' }}>
                                    Dựa trên kết quả phân tích loại da{' '}
                                    <Tag color="#E77D3B">{quizData?.skinTypeCode}</Tag> của bạn, chúng tôi đề xuất quy
                                    trình 3 bước cơ bản sau đây để đạt được làn da khỏe mạnh.
                                </Paragraph>
                            </Card>
                            <div style={{ marginBottom: 24 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: 12,
                                        backgroundColor: '#F1F8F6',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        borderLeft: '4px solid #7EBEB2',
                                    }}>
                                    <div
                                        style={{
                                            backgroundColor: '#7EBEB2',
                                            color: 'white',
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 10,
                                            fontWeight: 'bold',
                                        }}>
                                        1
                                    </div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        Sửa rửa mặt (Cleansers)
                                    </Title>
                                </div>
                                <Paragraph style={{ paddingLeft: 16, marginBottom: 16 }}>
                                    Bước đầu tiên và quan trọng nhất là làm sạch da, giúp loại bỏ bụi bẩn, dầu thừa và
                                    trang điểm. Đối với loại da {quizData?.skinTypeCode}, việc chọn sửa rửa mặt phù hợp
                                    giúp làm sạch mà không gây khô da hoặc kích ứng.
                                </Paragraph>
                                {renderProductSection('Sản phẩm đề xuất', quizData?.cleansers)}
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: 12,
                                        backgroundColor: '#F3F2F8',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        borderLeft: '4px solid #9E94CC',
                                    }}>
                                    <div
                                        style={{
                                            backgroundColor: '#9E94CC',
                                            color: 'white',
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 10,
                                            fontWeight: 'bold',
                                        }}>
                                        2
                                    </div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        Toner
                                    </Title>
                                </div>
                                <Paragraph style={{ paddingLeft: 16, marginBottom: 16 }}>
                                    Toner giúp cân bằng độ pH của da sau khi rửa mặt, loại bỏ tạp chất còn sót lại và
                                    chuẩn bị da để hấp thụ dưỡng chất tốt hơn. Với loại da {quizData?.skinTypeCode},
                                    toner sẽ giúp làm dịu và cân bằng da.
                                </Paragraph>
                                {renderProductSection('Sản phẩm đề xuất', quizData?.toners)}
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: 12,
                                        backgroundColor: '#FFF4F4',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        borderLeft: '4px solid #D8959A',
                                    }}>
                                    <div
                                        style={{
                                            backgroundColor: '#D8959A',
                                            color: 'white',
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 10,
                                            fontWeight: 'bold',
                                        }}>
                                        3
                                    </div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        Dưỡng Ẩm (Moisturizers)
                                    </Title>
                                </div>
                                <Paragraph style={{ paddingLeft: 16, marginBottom: 16 }}>
                                    Dưỡng ẩm giúp khóa độ ẩm, tăng cường hàng rào bảo vệ da và cung cấp các dưỡng chất
                                    cần thiết. Với đặc điểm của da {quizData?.skinTypeCode}, loại dưỡng ẩm này sẽ giúp
                                    cân bằng độ ẩm và đáp ứng nhu cầu cụ thể của làn da bạn.
                                </Paragraph>
                                {renderProductSection('Sản phẩm đề xuất', quizData?.moisturizers)}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
            {/* Modal xem trước và lưu hình ảnh */}
            <Modal
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                title="Xem trước và lưu kết quả"
                width={700}
                footer={[
                    <Button key="cancel" onClick={() => setPreviewVisible(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSaveImage}
                        style={{ backgroundColor: '#D8959A', borderColor: '#D8959A' }}>
                        Lưu hình ảnh
                    </Button>,
                ]}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 20 }}>
                        <Image src={previewImage} alt="Kết quả kiểm tra da" width="100%" />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                        <Text strong style={{ marginRight: 8 }}>
                            Tên file:
                        </Text>
                        <Input
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            addonAfter=".png"
                            addonBefore={<EditOutlined />}
                            style={{ width: 400 }}
                        />
                    </div>

                    <Paragraph type="secondary">
                        <InfoCircleOutlined style={{ marginRight: 5 }} />
                        Khi bạn nhấn lưu hình ảnh, trình duyệt sẽ tải hình ảnh xuống theo tên file đã nhập.
                    </Paragraph>
                </div>
            </Modal>
        </>
    );
};

export default QuizDetailModal;
