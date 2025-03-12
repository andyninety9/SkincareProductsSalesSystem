import React, { useState } from 'react';
import { Steps, Popover, message, Button } from 'antd';
import PropTypes from 'prop-types';
import api from '../../config/api';

// Define the steps for order status
const statusSteps = [
    { title: "Pending", description: "Order is awaiting confirmation" },
    { title: "Processing", description: "Order is being prepared" },
    { title: "Shipping", description: "Order is on its way" },
    { title: "Shipped", description: "Order has been shipped" },
    { title: "Completed", description: "Order has been delivered" },
    { title: "Cancel", description: "Order has been canceled" },
];

// Map numeric status to step index (0-based index for Steps component)
const statusToStepIndex = {
    1: 0, // Pending
    2: 1, // Processing
    3: 2, // Shipping
    4: 3, // Shipped
    5: 4, // Completed
    6: 5, // Cancel
};

// Map step index back to status number (for API calls)
const stepIndexToStatus = {
    0: 1, // Pending
    1: 2, // Processing
    2: 3, // Shipping
    3: 4, // Shipped
    4: 5, // Completed
    5: 6, // Cancel
};

// Map string status to numeric status
const stringStatusToNumeric = {
    "Pending": 1,
    "Processing": 2,
    "Shipping": 3,
    "Shipped": 4,
    "Completed": 5,
    "Cancel": 6,
};

// Utility function to safely convert order ID to BigInt string for API requests
const safeBigIntString = (value) => {
    console.log(`safeBigIntString input:`, value, typeof value);
    try {
        if (value === null || value === undefined) {
            throw new Error("Order ID is null or undefined");
        }
        // If value is already a BigInt, convert to string; otherwise, convert to BigInt first
        const bigIntValue = typeof value === 'bigint' ? value : BigInt(value);
        const result = bigIntValue.toString();
        console.log(`safeBigIntString output:`, result);
        return result;
    } catch (error) {
        console.error("Invalid BigInt conversion:", value, error.message);
        return null;
    }
};

// Custom dot for Steps component
const customDot = (dot, { status, index }) => (
    <Popover
        content={<span>Step {index + 1} status: {status}</span>}
    >
        {dot}
    </Popover>
);

const ManageOrderSteps = ({ status, currentOrderId, onStatusUpdate }) => {
    const [loading, setLoading] = useState(false);

    console.log(`ManageOrderSteps received props:`, { currentOrderId, type: typeof currentOrderId, status });

    // Ensure currentOrderId is converted to a BigInt string for API requests
    const orderIdString = safeBigIntString(currentOrderId);
    if (!orderIdString) {
        message.error('Invalid order ID. Please refresh the page and try again.');
        return null;
    }

    // Convert status to number, handling strings, numbers, and invalid values
    let numericStatus;
    if (typeof status === 'string') {
        numericStatus = stringStatusToNumeric[status] || 1; // Default to Pending if invalid string
    } else if (typeof status === 'number' && !isNaN(status)) {
        numericStatus = status; // Use numeric status directly
    } else {
        numericStatus = 1; // Default to Pending if status is invalid
    }

    const currentStep = statusToStepIndex[numericStatus] !== undefined
        ? statusToStepIndex[numericStatus]
        : 0; // Default to 0 (Pending) if invalid
    const currentStatus = stepIndexToStatus[currentStep];

    // Enhanced logging for debugging
    console.log(`Raw status prop:`, status, typeof status);
    console.log(`Calculated numericStatus:`, numericStatus);
    console.log(`Current step: ${currentStep}, Current status: ${currentStatus}`);

    // Handle status update (next or reverse)
    const handleStatusUpdate = async (action) => {
        if (loading) return; // Prevent clicks while loading

        if (!orderIdString) {
            message.error('Invalid order ID. Please refresh the page and try again.');
            return;
        }

        const isNext = action === 'next';
        const targetStep = isNext ? currentStep + 1 : currentStep - 1;
        const targetStatus = stepIndexToStatus[targetStep];

        // Validate the transition
        if (targetStep < 0 || targetStep >= statusSteps.length) {
            message.warning(`Cannot ${isNext ? 'proceed to next' : 'reverse to previous'} status.`);
            return;
        }

        // Prevent changing status of Completed or Cancelled orders
        if ([5, 6].includes(currentStatus)) {
            message.warning("Completed or Cancelled orders cannot be changed.");
            return;
        }

        // Prevent direct jumps to Completed without being Shipped
        if (isNext && targetStatus === 5 && currentStatus !== 4) {
            message.warning("Order must be Shipped before marking as Completed.");
            return;
        }

        // Prevent cancelling after Processing
        if (isNext && targetStatus === 6 && currentStatus > 2) {
            message.warning("Order can only be Cancelled from Pending or Processing.");
            return;
        }

        try {
            setLoading(true);
            const endpoint = `orders/${orderIdString}/${action}-status`;
            const payload = {
                note: isNext ? "Proceeding to next status." : "Reversing the status.",
                newStatus: targetStatus, // Include the target status explicitly
            };

            console.log('PATCH Request URL:', `${api.defaults.baseURL}${endpoint}`);
            console.log('PATCH Request Payload:', payload);
            console.log('Current Order ID:', orderIdString);
            console.log('Action:', action);

            const response = await api.patch(endpoint, payload);
            console.log('PATCH Response:', response.data); // Log full response
            if (response.data.statusCode === 200) {
                message.success(`Order ${orderIdString} status updated successfully!`);
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
        }
    };

    // Handle Cancel action separately
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
                newStatus: 6, // Explicitly set to Cancel
            };

            console.log('PATCH Request URL:', `${api.defaults.baseURL}${endpoint}`);
            console.log('PATCH Request Payload:', payload);
            console.log('Current Order ID:', orderIdString);
            console.log('Action:', 'cancel');

            const response = await api.patch(endpoint, payload);
            console.log('PATCH Response:', response.data); // Log full response
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
        }
    };

    // Determine if buttons should be disabled
    const isNextDisabled = currentStep >= statusSteps.length - 2 || [5, 6].includes(currentStatus);
    const isReverseDisabled = currentStep <= 0 || [5, 6].includes(currentStatus);
    const isCancelDisabled = currentStatus > 2 || [5, 6].includes(currentStatus);

    return (
        <div style={{ marginTop: "8px" }}>
            {/* Display current order status as text */}
            <p style={{ textAlign: "center", marginBottom: "16px" }}>Current Order Status: {statusSteps[currentStep].title}</p>
            <Steps
                current={currentStep}
                progressDot={customDot}
                items={statusSteps}
                disabled={loading}
            />
            <div style={{ marginTop: "16px", display: "flex", gap: "8px", justifyContent: "center" }}>
                <Button
                    type="primary"
                    onClick={() => handleStatusUpdate('reverse')}
                    disabled={isReverseDisabled || loading}
                >
                    Reverse
                </Button>
                <Button
                    type="primary"
                    onClick={() => handleStatusUpdate('next')}
                    disabled={isNextDisabled || loading}
                >
                    Next
                </Button>
                <Button
                    type="default"
                    danger
                    onClick={handleCancel}
                    disabled={isCancelDisabled || loading}
                >
                    Cancel Order
                </Button>
            </div>
            {loading && (
                <div style={{ marginTop: "8px", textAlign: "center" }}>
                    <Button type="primary" loading disabled>
                        Updating Status...
                    </Button>
                </div>
            )}
        </div>
    );
};

// Custom PropType validator for BigInt support
const bigIntPropType = (props, propName, componentName) => {
    const value = props[propName];
    if (value !== undefined) {
        try {
            BigInt(value); // Attempt to convert to BigInt
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