import React, { useEffect, useState } from 'react';
import {
    Modal,
    Button,
    Checkbox,
    InputNumber,
    Form,
    List,
    Image,
    Spin,
    Typography,
    Empty,
    Divider,
    Card,
    Tag,
} from 'antd';
import PropTypes from 'prop-types';
import api from '../../config/api';
import { toast } from 'react-hot-toast';

const { Text } = Typography;

const ReturnRequestModal = ({ visible, onClose, order, products }) => {
    const [form] = Form.useForm();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pendingReturns, setPendingReturns] = useState([]);

    const handleGetReturnedProducts = async () => {
        try {
            setLoading(true);

            if (!order || !order.orderId) {
                console.warn('No order information available');
                setLoading(false);
                return;
            }

            // Convert orderId to BigInt for consistency (if needed)
            const orderIdStr = BigInt(order.orderId).toString();
            const response = await api.get(`return/list?orderId=${orderIdStr}`);

            if (response.data.statusCode === 200) {
                const returnItems = response.data.data.items || [];

                // Convert IDs to BigInt and filter pending returns
                const pendingReturnItems = returnItems
                    .map((item) => ({
                        ...item,
                        returnId: BigInt(item.returnId),
                        orderId: BigInt(item.orderId),
                        // Preserve the rest of the properties
                    }))
                    .filter((item) => item.returnStatus === false);

                setPendingReturns(pendingReturnItems);
                console.log('Pending return items with BigInt IDs:', pendingReturnItems);
            } else {
                toast.error(response.data.message || 'Đã xảy ra lỗi khi tải dữ liệu');
            }
        } catch (error) {
            console.error('Error getting returned products:', error);
            toast.error('Đã xảy ra lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Reset state when modal opens/closes
    useEffect(() => {
        if (visible) {
            setSelectedProducts([]);
            form.resetFields();
        }
        handleGetReturnedProducts();
    }, [visible, form]);

    const handleProductSelection = (productId, checked) => {
        if (checked) {
            setSelectedProducts([...selectedProducts, productId]);
        } else {
            setSelectedProducts(selectedProducts.filter((id) => id !== productId));
        }
    };

    const handleSubmit = async () => {
        try {
            // Check if order exists
            if (!order || !order.orderId) {
                toast.error('Không tìm thấy thông tin đơn hàng');
                onClose();
                return;
            }

            const values = await form.validateFields();
            setLoading(true);

            // Helper function to safely convert ID to BigInt format for API
            const toBigIntString = (value) => {
                try {
                    // Convert to BigInt then back to string to preserve full precision
                    return BigInt(value).toString();
                } catch (e) {
                    console.error('Error converting to BigInt:', e);
                    return value.toString();
                }
            };

            const returnProducts = Object.entries(values)
                .filter(
                    ([key, value]) =>
                        key.startsWith('product_') && selectedProducts.includes(parseInt(key.split('_')[1]))
                )
                .map(([key, value]) => {
                    // Extract the productId part after "product_"
                    const productIdStr = key.split('_')[1];

                    return {
                        // Send productId in BigInt format
                        productId: toBigIntString(productIdStr),
                        quantity: parseInt(value),
                    };
                });

            if (returnProducts.length === 0) {
                toast.error('Vui lòng chọn ít nhất một sản phẩm để hoàn trả');
                setLoading(false);
                return;
            }

            // Convert orderId to BigInt format
            const ordId = toBigIntString(order.orderId);

            // Create the request payload with exact structure as required
            const payload = {
                ordId,
                returnProducts,
            };

            // Log data being sent to API for debugging
            console.log('Submitting return request:', payload);

            // Use JSON.stringify with a replacer function to handle BigInt values
            const jsonPayload = JSON.stringify(payload);

            const response = await api.post('return/create', JSON.parse(jsonPayload));

            if (response.data.statusCode === 200) {
                toast.success('Yêu cầu hoàn trả đã được gửi thành công!');
                onClose();
            } else {
                toast.error(response.data.message || 'Đã xảy ra lỗi khi gửi yêu cầu');
            }
        } catch (error) {
            console.error('Error submitting return request:', error);
            toast.error('Đã xảy ra lỗi khi gửi yêu cầu hoàn trả');
        } finally {
            setLoading(false);
        }
    };

    // Guard clause for when order is null
    if (!order) {
        return null;
    }

    const getAvailableQuantity = (productId) => {
        const pendingQuantity = pendingReturns.reduce((total, returnItem) => {
            const matchingProduct = (returnItem.returnProductDetails || []).find(
                (detail) => detail.productId === productId
            );
            return total + (matchingProduct ? matchingProduct.quantity : 0);
        }, 0);

        // Find the original product to get purchased quantity
        const originalProduct = products.find((p) => p.productId === productId);
        if (!originalProduct) return 0;

        // Calculate available quantity for return
        const availableQuantity = originalProduct.quantity - pendingQuantity;
        return Math.max(0, availableQuantity);
    };

    return (
        <Modal
            title={<span style={{ color: '#D8959A', fontWeight: 'bold' }}>Yêu Cầu Hoàn Trả</span>}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={selectedProducts.length === 0}
                    style={{ backgroundColor: '#D8959A', borderColor: '#D8959A' }}>
                    Gửi Yêu Cầu
                </Button>,
            ]}
            width={600}>
            <Spin spinning={loading}>
                {pendingReturns.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                        <Divider orientation="left">
                            <Text strong>Sản phẩm đang chờ hoàn trả</Text>
                        </Divider>

                        {pendingReturns.map((returnItem) => (
                            <Card
                                key={returnItem.returnId}
                                size="small"
                                style={{ marginBottom: 10 }}
                                title={
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                        <span>Mã hoàn trả: {returnItem.returnId.toString()}</span>
                                        <Tag color="orange">Chờ duyệt</Tag>
                                    </div>
                                }>
                                <Text>Ngày yêu cầu: {returnItem.returnDate}</Text>
                                <Text style={{ display: 'block' }}>
                                    Số tiền hoàn trả: đ{returnItem.refundAmount?.toLocaleString()}
                                </Text>

                                <List
                                    itemLayout="horizontal"
                                    dataSource={returnItem.returnProductDetails || []}
                                    renderItem={(product) => (
                                        <List.Item style={{ padding: '8px 0' }}>
                                            <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                                <Image
                                                    src={product.productImage || 'https://via.placeholder.com/50'}
                                                    alt={product.productName}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        objectFit: 'cover',
                                                        marginRight: '12px',
                                                    }}
                                                    preview={false}
                                                    fallback="https://via.placeholder.com/50"
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold' }}>{product.productName}</div>
                                                    <div style={{ fontSize: '12px', color: '#888' }}>
                                                        Số lượng: {product.quantity} | Đơn giá: đ
                                                        {product.sellPrice?.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        ))}
                        <Divider />
                    </div>
                )}
                {products && products.length > 0 ? (
                    <Form form={form} layout="vertical">
                        <div style={{ marginBottom: '16px' }}>
                            <Text>Vui lòng chọn sản phẩm bạn muốn hoàn trả từ đơn hàng #{order.orderId}:</Text>
                        </div>

                        <List
                            itemLayout="horizontal"
                            dataSource={products}
                            renderItem={(product) => (
                                <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                                    <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                        <Checkbox
                                            onChange={(e) =>
                                                handleProductSelection(product.productId, e.target.checked)
                                            }
                                            style={{ marginRight: '16px' }}
                                            disabled={getAvailableQuantity(product.productId) <= 0}
                                        />

                                        <Image
                                            src={product.images?.[0] || 'https://via.placeholder.com/60'}
                                            alt={product.productName}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover',
                                                marginRight: '16px',
                                            }}
                                            preview={false}
                                            fallback="https://via.placeholder.com/60"
                                        />

                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold' }}>{product.productName}</div>
                                            <div style={{ fontSize: '12px', color: '#888' }}>
                                                Số lượng đã mua: {product.quantity} | Đơn giá: đ
                                                {product.unitPrice?.toLocaleString()}
                                            </div>
                                        </div>

                                        <Form.Item
                                            name={`product_${product.productId}`}
                                            initialValue={1}
                                            style={{ margin: 0 }}
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập số lượng' },
                                                {
                                                    validator: (_, value) => {
                                                        if (!value || value <= 0) {
                                                            return Promise.reject('Số lượng phải lớn hơn 0');
                                                        }

                                                        const availableQty = getAvailableQuantity(product.productId);
                                                        if (value > availableQty) {
                                                            return Promise.reject(
                                                                `Không được vượt quá ${availableQty} (đã trừ ${
                                                                    product.quantity - availableQty
                                                                } đang chờ hoàn trả)`
                                                            );
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                },
                                            ]}>
                                            <InputNumber
                                                min={1}
                                                max={getAvailableQuantity(product.productId)}
                                                disabled={
                                                    !selectedProducts.includes(product.productId) ||
                                                    getAvailableQuantity(product.productId) <= 0
                                                }
                                                style={{ width: '70px' }}
                                            />
                                        </Form.Item>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Form>
                ) : (
                    <Empty description="Không tìm thấy sản phẩm nào để hoàn trả" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </Spin>
        </Modal>
    );
};

ReturnRequestModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    order: PropTypes.object,
    products: PropTypes.array,
};

export default ReturnRequestModal;
