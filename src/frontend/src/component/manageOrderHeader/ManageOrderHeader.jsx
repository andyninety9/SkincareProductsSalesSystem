// src/component/manageOrderHeader/ManageOrderHeader.jsx
import React from "react";
import { Layout, Typography } from "antd";
import { BellOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types'; // For PropTypes validation

const { Header } = Layout;
const { Text } = Typography;

const ManageOrderHeader = ({ isModalOpen }) => {
    return (
        <Header
            style={{
                background: '#fff',
                display: 'flex', // Keep navbar visible
                alignItems: 'center',
                padding: '12px 24px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                width: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1050,
                tabIndex: isModalOpen ? "-1" : "0", // Still disable focus when modal is open
            }}
        >
            <Text
                style={{
                    fontFamily: 'Marko One, serif',
                    fontSize: '38px',
                    fontWeight: 'bold',
                    color: '#000',
                }}
            >
                Mavid
            </Text>

            <div
                style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                }}
            >
                <MessageOutlined
                    style={{
                        fontSize: '23px',
                        cursor: 'pointer',
                        color: '#000',
                    }}
                />

                <BellOutlined
                    style={{
                        fontSize: '23px',
                        cursor: 'pointer',
                        color: '#000',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        gap: '8px',
                    }}
                >
                    <UserOutlined
                        style={{
                            fontSize: '23px',
                            cursor: 'pointer',
                            color: '#000',
                        }}
                    />

                    <Text
                        style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            marginLeft: '10px',
                            color: '#000',
                        }}
                    >
                        Staff Name
                    </Text>
                </div>
            </div>
        </Header>
    );
};

// Add PropTypes validation
ManageOrderHeader.propTypes = {
    isModalOpen: PropTypes.bool, // Optional boolean prop to indicate if modal is open
};

export default ManageOrderHeader;