import React, { useState } from 'react';
import { Steps, Popover, message, Button } from 'antd';
import PropTypes from 'prop-types';
import api from '../../config/api';
import './ManageOrderSteps.css';

const statusSteps = [
    { title: "Pending", description: "Order is awaiting confirmation" },
    { title: "Processing", description: "Order is being prepared" },
    { title: "Shipping", description: "Order is on its way" },
    { title: "Shipped", description: "Order has been shipped" },
    { title: "Completed", description: "Order has been delivered" },
    { title: "Cancel", description: "Order has been canceled" },
];

const statusMap = {
    "Pending": 1, "Processing": 2, "Shipping": 3, "Shipped": 4, "Completed": 5, "Cancel": 6
};

const safeBigIntString = (value) => {
    try {
        if (value == null) throw new Error("Order ID is null or undefined");
        return (typeof value === 'bigint' ? value : BigInt(value)).toString();
    } catch (error) {
        console.error("Invalid BigInt conversion:", value, error.message);
        return null;
    }
};

const getNumericStatus = (status) => typeof status === 'string' ? (statusMap[status] || 1) : (Number.isNaN(status) ? 1 : status);

const customDot = (dot, { status, index, currentStep }) => (
    <Popover
        content={<span style={{ color: index <= currentStep ? '#C87E83' : undefined }}>Step {index + 1} status: {status}</span>}
    >
        {dot}
    </Popover>
);

const ManageOrderSteps = ({ status, currentOrderId, onStatusUpdate }) => {
    const [loading, setLoading] = useState(false);
    const orderIdString = safeBigIntString(currentOrderId);

    if (!orderIdString) {
        message.error('Invalid order ID. Please refresh the page and try again.');
        return null;
    }

    const currentStep = Math.max(0, Math.min(getNumericStatus(status) - 1, statusSteps.length - 1));
    const currentStatus = currentStep + 1;

    const validateAndPrepare = () => {
        if (loading) return false;
        if ([5, 6].includes(currentStatus)) {
            message.warning("Completed or Cancelled orders cannot be changed.");
            return false;
        }
        return true;
    };

    const updateStatus = async (endpoint, payload, successMessage) => {
        try {
            setLoading(true);
            const response = await api.patch(endpoint, payload);
            if (response.data.statusCode !== 200) throw new Error(response.data.message || 'Unexpected response');
            message.success(successMessage);
            onStatusUpdate?.();
        } catch (error) {
            message.error(`Failed to update order: ${error.response?.data?.details?.description || error.response?.data?.message || error.message || 'An unknown error occurred'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleStepChange = async (targetStep) => {
        if (!validateAndPrepare()) return;

        const targetStatus = targetStep + 1;
        const isReverse = targetStep < currentStep;
        const stepDifference = Math.abs(targetStep - currentStep);

        if (stepDifference > 1) {
            message.warning("Cannot skip stages. Please move to the next or previous stage only.");
            return;
        }

        if (targetStatus === 5 && currentStatus !== 4) {
            message.warning("Order must be Shipped before marking as Completed.");
            return;
        }

        if (targetStatus === 6 && currentStatus > 2) {
            message.warning("Order can only be Cancelled from Pending or Processing.");
            return;
        }

        const endpoint = `orders/${orderIdString}/${isReverse ? 'reverse-status' : 'next-status'}`;
        const payload = { note: `Changing status to ${statusSteps[targetStep].title}${isReverse ? ' (reverse)' : ''}`, newStatus: targetStatus };
        await updateStatus(endpoint, payload, `Order ${orderIdString} status updated to ${statusSteps[targetStep].title}!`);
    };

    const handleCancel = async () => {
        if (!validateAndPrepare()) return;
        if (currentStatus > 2) {
            message.warning("Order can only be Cancelled from Pending or Processing.");
            return;
        }

        const endpoint = `orders/${orderIdString}/next-status`;
        const payload = { note: "Cancelling the order.", newStatus: 6 };
        await updateStatus(endpoint, payload, `Order ${orderIdString} cancelled successfully!`);
    };

    return (
        <div className="manage-order-steps">
            <Steps
                current={currentStep}
                progressDot={(dot, props) => customDot(dot, { ...props, currentStep })}
                items={statusSteps}
                onChange={handleStepChange}
                disabled={loading}
            />
            {loading && (
                <div className="loading-container">
                    <Button type="primary" loading disabled>
                        Updating Status...
                    </Button>
                </div>
            )}
        </div>
    );
};

ManageOrderSteps.propTypes = {
    status: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    currentOrderId: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(BigInt)]).isRequired,
    onStatusUpdate: PropTypes.func,
};

export default ManageOrderSteps;