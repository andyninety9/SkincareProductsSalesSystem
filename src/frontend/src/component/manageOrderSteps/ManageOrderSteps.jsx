import React from 'react';
import { Steps, Popover } from 'antd';
import PropTypes from 'prop-types'; // Import PropTypes

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

// Custom dot for Steps component
const customDot = (dot, { status, index }) => (
    <Popover
        content={
            <span>
                Step {index + 1} status: {status}
            </span>
        }
    >
        {dot}
    </Popover>
);

const OrderStatusSteps = ({ status }) => {
    // Determine the current step index based on the order status
    const currentStep = typeof status === 'number' ? statusToStepIndex[status] : -1;

    return (
        <div style={{ marginTop: "8px" }}>
            <Steps
                current={currentStep}
                progressDot={customDot}
                items={statusSteps}
            />
        </div>
    );
};

// Add PropTypes validation
OrderStatusSteps.propTypes = {
    status: PropTypes.oneOfType([
        PropTypes.number, // Allow numbers (e.g., 1, 2, 3, etc.)
        PropTypes.string, // Allow strings (e.g., "N/A")
    ]).isRequired, // Mark status as required
};

export default OrderStatusSteps;