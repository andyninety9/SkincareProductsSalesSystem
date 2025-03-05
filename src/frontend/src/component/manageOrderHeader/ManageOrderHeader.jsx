import React from "react";
import { Layout, Typography, Space, Avatar } from "antd";
import { BellOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

const ManageOrderHeader = () => {
    return (

        <Header
            style={{
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                width: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1050,
            }}
        >
            <Text
                style={{
                    fontFamily: 'Marko One, serif',
                    fontSize: '38px',
                    fontWeight: 'bold',
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
                        transition: 'color 0.3s',
                    }}
                    onMouseOver={(e) => (e.target.style.color = '#333')}
                    onMouseOut={(e) => (e.target.style.color = '')}
                />

                <BellOutlined
                    style={{
                        fontSize: '23px',
                        cursor: 'pointer',
                        transition: 'color 0.3s',
                    }}
                    onMouseOver={(e) => (e.target.style.color = '#333')}
                    onMouseOut={(e) => (e.target.style.color = '')}
                />

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        gap: '8px',
                        transition: 'color 0.3s',
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.querySelector('.staff-name').style.color = '#333';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.querySelector('.staff-name').style.color = '';
                    }}
                >
                    <UserOutlined
                        style={{
                            fontSize: '23px',
                            cursor: 'pointer',
                            transition: 'color 0.3s',
                        }}
                        onMouseOver={(e) => (e.target.style.color = '#333')}
                        onMouseOut={(e) => (e.target.style.color = '')} />

                    <Text className="staff-name" style={{ fontSize: '16px', fontWeight: '600', marginLeft: "10px" }}>
                        Staff Name
                    </Text>
                </div>
            </div>
        </Header>

    );
};

export default ManageOrderHeader;
