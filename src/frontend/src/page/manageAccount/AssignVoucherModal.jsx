import { Modal, Form, Input, message } from 'antd';
import PropTypes from 'prop-types';
import api from '../../config/api';

const customColor = '#E6B2BA';

const AssignVoucherModal = ({
    visible,
    onCancel,
    onAssign,
    selectedUser,
    form,
}) => {
    const handleAssignVoucher = async (values) => {
        if (!selectedUser) return;
        try {
            const payload = {
                voucherDesc: values.voucherDesc,
                statusVoucher: true, // Hardcode statusVoucher to true
                voucherDiscount: values.voucherDiscount,
                usrId: selectedUser.usrId.toString(),
            };
            const response = await api.post('User/assign-voucher', payload);
            if (response.status === 200) {
                message.success('🎉 Voucher assigned successfully!', 2);
                onAssign();
            } else {
                message.error('⚠️ Failed to assign voucher!', 2);
            }
        } catch (error) {
            console.error('❌ Assign voucher failed:', error);
            if (error.response) {
                message.error(`⚠️ Error: ${error.response.data.message || 'Failed to assign voucher'}`, 2);
            } else {
                message.error('⚠️ Error connecting to server!', 2);
            }
        }
    };

    return (
        <Modal
            title="Assign Voucher"
            visible={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            okButtonProps={{
                style: {
                    backgroundColor: customColor, // Set OK button background to #E6B2BA
                    borderColor: customColor, // Match border color to background
                    color: '#fff', // White text for contrast
                },
            }}
        >
            <Form form={form} onFinish={handleAssignVoucher} layout="vertical">
                <Form.Item
                    name="voucherDesc"
                    label="Voucher Description"
                    rules={[{ required: true, message: 'Please enter a voucher description' }]}
                >
                    <Input
                        placeholder="Enter voucher description"
                        style={{
                            borderColor: customColor,
                            backgroundColor: `${customColor}20`,
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="voucherDiscount"
                    label="Voucher Discount (%)"
                    rules={[
                        { required: true, message: 'Please enter a discount percentage' },
                    ]}
                >
                    <Input
                        type="number"
                        placeholder="Enter discount percentage (e.g., 20)"
                        min={0}
                        max={100}
                        style={{
                            borderColor: customColor,
                            backgroundColor: `${customColor}20`,
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="usrId"
                    label="User ID"
                    initialValue={selectedUser?.usrId.toString()}
                    rules={[{ required: true, message: 'User ID is required' }]}
                >
                    <Input
                        style={{
                            borderColor: customColor,
                            backgroundColor: `${customColor}20`,
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

AssignVoucherModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onAssign: PropTypes.func.isRequired,
    selectedUser: PropTypes.shape({
        usrId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    }),
    form: PropTypes.object.isRequired,
};

export default AssignVoucherModal;