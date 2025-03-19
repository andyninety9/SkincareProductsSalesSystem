import React, { useEffect, useState } from 'react';
import { Modal, Rate, Input, Button, Form, Typography, Upload, Divider } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import api from '../../config/api';
import { toast } from 'react-hot-toast';

const { TextArea } = Input;
const { Text, Title } = Typography;

const countWords = (text) => {
    return text
        ? text
              .trim()
              .split(/\s+/)
              .filter((word) => word.length > 0).length
        : 0;
};

const ReviewProductModal = ({ visible, onClose, product, orderId, onSuccess, orderStatus }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [ratingValue, setRatingValue] = useState(0);

    useEffect(() => {
        if (visible && orderStatus !== 'Completed') {
            toast.error('Chỉ có thể đánh giá sản phẩm khi đơn hàng đã hoàn thành!');
            onClose();
        }
    }, [visible, orderStatus, onClose]);

    const handleSubmit = async () => {
        try {
            // Double-check order status before submitting
            if (orderStatus !== 'Completed') {
                toast.error('Chỉ có thể đánh giá sản phẩm khi đơn hàng đã hoàn thành!');
                return;
            }

            setLoading(true);
            const values = await form.validateFields();
            const finalRating = ratingValue || values.rating;
            if (!finalRating) {
                toast.error('Vui lòng đánh giá số sao cho sản phẩm!');
                return;
            }
            // Check word count limit
            if (values.comment && countWords(values.comment) > 1000) {
                throw new Error('Vui lòng giới hạn nhận xét trong 1000 từ');
            }

            // Prepare request data
            const reviewData = {
                userId: orderId,
                prodID: product?.productId.toString(),
                rating: finalRating,
                reviewContent: values.comment || '',
            };

            // API call to submit review
            const response = await api.post(`products/review/create`, reviewData);

            if (response?.data?.statusCode === 200) {
                // Remove this toast.success call to avoid duplication
                form.resetFields();
                if (onSuccess) onSuccess('Đánh giá sản phẩm thành công!'); // Pass success message to parent
                onClose();
            } else {
                throw new Error(response?.data?.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error?.message || 'Có lỗi xảy ra khi đánh giá sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const validateWordCount = (_, value) => {
        if (!value) return Promise.resolve();
        const wordCount = countWords(value);
        return wordCount <= 1000 ? Promise.resolve() : Promise.reject(new Error(`Quá giới hạn: ${wordCount}/1000 từ`));
    };

    return (
        <Modal
            title={null}
            open={visible && orderStatus === 'Completed'} // Only open if order is completed
            onCancel={onClose}
            footer={null}
            width={520}
            className="review-modal"
            style={{ borderRadius: '12px', overflow: 'hidden' }}
            bodyStyle={{ padding: '24px' }}>
            {product && (
                <div className="product-review-content">
                    <Title level={4} style={{ color: '#D8959A', marginBottom: '16px', textAlign: 'center' }}>
                        Đánh giá sản phẩm
                    </Title>

                    <div
                        className="product-info"
                        style={{
                            display: 'flex',
                            marginBottom: '24px',
                            alignItems: 'center',
                            backgroundColor: '#f9f9f9',
                            padding: '12px',
                            borderRadius: '8px',
                        }}>
                        <img
                            src={product.images?.[0] || 'https://via.placeholder.com/80'}
                            alt={product.productName}
                            style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                marginRight: '16px',
                                border: '1px solid #eaeaea',
                            }}
                        />
                        <div>
                            <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '6px' }}>
                                {product.productName}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                                {product.productDesc?.substring(0, 120)}
                                {product.productDesc?.length > 120 ? '...' : ''}
                            </Text>
                        </div>
                    </div>

                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="rating"
                            label={
                                <Text strong style={{ fontSize: '15px' }}>
                                    Đánh giá của bạn về sản phẩm
                                </Text>
                            }>
                            <Rate
                                allowHalf
                                style={{ fontSize: '36px', color: '#D8959A' }}
                                onChange={(value) => {
                                    setRatingValue(value);
                                    form.setFieldsValue({ rating: value });
                                }}
                            />
                        </Form.Item>
                        {ratingValue === 0 && (
                            <div
                                style={{
                                    color: '#ff4d4f',
                                    fontSize: '14px',
                                    marginTop: '-20px',
                                    marginBottom: '10px',
                                }}>
                                Vui lòng đánh giá số sao cho sản phẩm!
                            </div>
                        )}

                        <Form.Item
                            name="comment"
                            label={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text strong style={{ fontSize: '15px' }}>
                                        Chia sẻ cảm nhận của bạn
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        Tối đa 1000 từ
                                    </Text>
                                </div>
                            }
                            rules={[{ validator: validateWordCount }]}>
                            <TextArea
                                rows={5}
                                placeholder="Sản phẩm có hiệu quả không? Bạn thích điều gì ở sản phẩm này? Hãy chia sẻ trải nghiệm của bạn..."
                                style={{ borderRadius: '6px', fontSize: '14px' }}
                                onChange={(e) => {
                                    const wordCount = countWords(e.target.value);
                                    if (wordCount > 1000) {
                                        form.setFields([
                                            {
                                                name: 'comment',
                                                errors: [`Quá giới hạn: ${wordCount}/1000 từ`],
                                            },
                                        ]);
                                    }
                                }}
                            />
                        </Form.Item>

                        <Divider style={{ margin: '24px 0 16px' }} />

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '12px',
                            }}>
                            <Button
                                onClick={onClose}
                                style={{
                                    width: '45%',
                                    height: '40px',
                                    borderRadius: '6px',
                                }}>
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                loading={loading}
                                onClick={handleSubmit}
                                style={{
                                    backgroundColor: '#D8959A',
                                    borderColor: '#D8959A',
                                    width: '55%',
                                    height: '40px',
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                }}>
                                Gửi đánh giá
                            </Button>
                        </div>
                    </Form>
                </div>
            )}
        </Modal>
    );
};

ReviewProductModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    product: PropTypes.object,
    orderId: PropTypes.string,
    orderStatus: PropTypes.string,
    onSuccess: PropTypes.func,
};

export default ReviewProductModal;
