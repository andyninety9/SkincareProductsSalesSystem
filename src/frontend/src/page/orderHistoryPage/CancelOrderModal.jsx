import React, { useState } from 'react';
import { Modal, Input, Typography, Button, Radio, Space } from 'antd';
import PropTypes from 'prop-types';
import './CancelOrderModal.css';

const { TextArea } = Input;
const { Text } = Typography;

const CancelOrderModal = ({ visible, onClose, onSubmit, loading }) => {
    const [reason, setReason] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');

    // Suggested reasons for cancellation
    const reasonTemplates = [
        'Tôi đã đổi ý và không muốn mua sản phẩm này nữa',
        'Tôi đã đặt nhầm sản phẩm',
        'Tôi muốn thay đổi thông tin đơn hàng',
        'Tôi tìm thấy sản phẩm tương tự với giá tốt hơn',
        'Tôi gặp vấn đề về thanh toán',
    ];

    const handleTemplateSelect = (value) => {
        setSelectedTemplate(value);
        setReason(value);
    };

    const handleSubmit = () => {
        onSubmit(reason);
    };
    

    return (
        <Modal
            title="Hủy đơn hàng"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Hủy bỏ
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit}
                    disabled={!reason.trim()}
                    style={{ backgroundColor: '#D8959A', borderColor: '#D8959A' }}>
                    Xác nhận hủy đơn
                </Button>,
            ]}
            width={500}>
            <div style={{ marginBottom: '20px' }}>
                <Text>Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này:</Text>
            </div>

            <Radio.Group
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                style={{ width: '100%', marginBottom: '16px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    {reasonTemplates.map((template, index) => (
                        <Radio
                            key={index}
                            value={template}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                backgroundColor: selectedTemplate === template ? '#FFF1F0' : 'transparent',
                            }}>
                            {template}
                        </Radio>
                    ))}
                    <Radio value="other" style={{ width: '100%', padding: '8px' }}>
                        Lý do khác
                    </Radio>
                </Space>
            </Radio.Group>

            {selectedTemplate === 'other' && (
                <TextArea
                    rows={4}
                    placeholder="Nhập lý do hủy đơn hàng"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    maxLength={1000}
                    showCount
                    style={{
                        borderRadius: '8px',
                        resize: 'none',
                        padding: '12px',
                        fontSize: '14px',
                        borderColor: '#d9d9d9',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    }}
                    className="custom-textarea"
                    status={reason.length > 900 ? 'warning' : ''}
                    autoSize={{ minRows: 4, maxRows: 6 }}
                />
            )}
        </Modal>
    );
};

CancelOrderModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default CancelOrderModal;
