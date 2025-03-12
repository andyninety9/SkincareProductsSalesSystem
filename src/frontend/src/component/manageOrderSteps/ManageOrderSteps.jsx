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

const statusToStepIndex = {
    1: 0, // Pending
    2: 1, // Processing
    3: 2, // Shipping
    4: 3, // Shipped
    5: 4, // Completed
    6: 5, // Cancel
};

const stepIndexToStatus = {
    0: 1, // Pending
    1: 2, // Processing
    2: 3, // Shipping
    3: 4, // Shipped
    4: 5, // Completed
    5: 6, // Cancel
};

const stringStatusToNumeric = {
    "Pending": 1,
    "Processing": 2,
    "Shipping": 3,
    "Shipped": 4,
    "Completed": 5,
    "Cancel": 6,
};

const safeBigIntString = (value) => {
    console.log(`safeBigIntString input:`, value, typeof value);
    try {
        if (value === null || value === undefined) {
            throw new Error("Order ID is null or undefined");
        }
        const bigIntValue = typeof value === 'bigint' ? value : BigInt(value);
        const result = bigIntValue.toString();
        console.log(`safeBigIntString output:`, result);
        return result;
    } catch (error) {
        console.error("Invalid BigInt conversion:", value, error.message);
        return null;
    }
};

// Custom dot with dynamic popover text color for current and finished steps
const customDot = (dot, { status, index, currentStep }) => (
    <Popover
        content={
            <span style={{ color: index <= currentStep ? '#C87E83' : undefined }}>
                Step {index + 1} status: {status}
            </span>
        }
    >
        {dot}
    </Popover>
);

const ManageOrderSteps = ({ status, currentOrderId, onStatusUpdate }) => {
    const [loading, setLoading] = useState(false);

    console.log(`ManageOrderSteps received props:`, { currentOrderId, type: typeof currentOrderId, status });

    const orderIdString = safeBigIntString(currentOrderId);
    if (!orderIdString) {
        message.error('Invalid order ID. Please refresh the page and try again.');
        return null;
    }

    let numericStatus;
    if (typeof status === 'string') {
        numericStatus = stringStatusToNumeric[status] || 1;
    } else if (typeof status === 'number' && !isNaN(status)) {
        numericStatus = status;
    } else {
        numericStatus = 1;
    }

    const currentStep = statusToStepIndex[numericStatus] !== undefined ? statusToStepIndex[numericStatus] : 0;
    const currentStatus = stepIndexToStatus[currentStep];

    const handleStepChange = async (targetStep) => {
        if (loading) return;
        if (!orderIdString) {
            message.error('Invalid order ID. Please refresh the page and try again.');
            return;
        }

        const targetStatus = stepIndexToStatus[targetStep];
        const isReverse = targetStep < currentStep;

        if ([5, 6].includes(currentStatus)) {
            message.warning("Completed or Cancelled orders cannot be changed.");
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

        try {
            setLoading(true);
            const endpoint = isReverse ? `orders/${orderIdString}/reverse-status` : `orders/${orderIdString}/next-status`;
            const payload = {
                note: `Changing status to ${statusSteps[targetStep].title}${isReverse ? ' (reverse)' : ''}`,
                newStatus: targetStatus,
            };

            console.log('PATCH Request URL:', `${api.defaults.baseURL}${endpoint}`);
            console.log('PATCH Request Payload:', payload);
            console.log('Current Order ID:', orderIdString);

            const response = await api.patch(endpoint, payload);
            console.log('PATCH Response:', response.data);
            if (response.data.statusCode === 200) {
                message.success(`Order ${orderIdString} status updated to ${statusSteps[targetStep].title}!`);
                if (onStatusUpdate) {
                    console.log('Calling onStatusUpdate to refresh orders');
                    onStatusUpdate();
                }
            } else {
                throw new Error(response.data.message || 'Unexpected response from server');
            }
        } catch (error) {
            console.error(`Error updating order status for orderId ${orderIdString}:`, error.response?.data || error.message);
            console.log(`Failed orderId:`, currentOrderId, typeof currentOrderId);
            console.log(`Failed orderId as string:`, orderIdString);
            const errorMessage = error.response?.data?.details?.description || error.response?.data?.message || error.message || 'An unknown error occurred';
            message.error(`Failed to update order: ${errorMessage}`);
        } finally {
            setLoading(false);
            console.log(`Loading state reset to false after step change`);
        }
    };

    const handleCancel = async () => {
        if (loading) return;
        if (!orderIdString) {
            message.error('Invalid order ID. Please refresh the page and try again.');
            return;
        }

        if (currentStatus > 2) {
            message.warning("Order can only be Cancelled from Pending or Processing.");
            return;
        }
        if ([5, 6].includes(currentStatus)) {
            message.warning("Completed or Cancelled orders cannot be changed.");
            return;
        }

        try {
            setLoading(true);
            const endpoint = `orders/${orderIdString}/next-status`;
            const payload = {
                note: "Cancelling the order.",
                newStatus: 6,
            };

            console.log('PATCH Request URL:', `${api.defaults.baseURL}${endpoint}`);
            console.log('PATCH Request Payload:', payload);
            console.log('Current Order ID:', orderIdString);
            console.log('Action:', 'cancel');

            const response = await api.patch(endpoint, payload);
            console.log('PATCH Response:', response.data);
            if (response.data.statusCode === 200) {
                message.success(`Order ${orderIdString} cancelled successfully!`);
                if (onStatusUpdate) {
                    console.log('Calling onStatusUpdate to refresh orders');
                    onStatusUpdate();
                }
            } else {
                throw new Error(response.data.message || 'Unexpected response from server');
            }
        } catch (error) {
            console.error(`Error cancelling order for orderId ${orderIdString}:`, error.response?.data || error.message);
            console.log(`Failed orderId:`, currentOrderId, typeof currentOrderId);
            console.log(`Failed orderId as string:`, orderIdString);
            const errorMessage = error.response?.data?.details?.description || error.response?.data?.message || error.message || 'An unknown error occurred';
            message.error(`Failed to cancel order: ${errorMessage}`);
        } finally {
            setLoading(false);
            console.log(`Loading state reset to false after cancel`);
        }
    };

    const isCancelDisabled = currentStatus > 2 || [5, 6].includes(currentStatus);
    console.log(`Cancel button disabling state: isCancelDisabled=${isCancelDisabled}, loading=${loading}`);

    return (
        <div className="manage-order-steps">

            <Steps
                current={currentStep}
                progressDot={customDot}
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

const bigIntPropType = (props, propName, componentName) => {
    const value = props[propName];
    if (value !== undefined) {
        try {
            BigInt(value);
        } catch (error) {
            return new Error(
                `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected a value that can be converted to BigInt.`
            );
        }
    }
};

ManageOrderSteps.propTypes = {
    status: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    currentOrderId: bigIntPropType,
    onStatusUpdate: PropTypes.func,
};

export default ManageOrderSteps;