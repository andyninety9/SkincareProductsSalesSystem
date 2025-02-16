import React from 'react';
import { Card, Typography } from 'antd';
import event3 from "../../assets/event3.png";
const { Title, Text } = Typography;

const CardEvent = ({ imageSrc, productName, price }) => {
    return (
        <Card
            hoverable
            style={{
                height: 350,
                width: 260,
                borderRadius: '10px',
                overflow: 'hidden',
                textAlign: 'center'
            }}
            cover={
                <img
                    alt={productName}
                    src={event3}
                    style={{ 
                        borderRadius: '10px 10px 0 0', 
                        objectFit: 'cover', 
                        height: 240 
                    }}
                />
            }
            bodyStyle={{ padding: '16px' }}
        >
            {/* Wrap text content in a fixed height container */}
            <div style={{ height: 80, overflow: 'hidden' }}>
                <Title
                    level={5}
                    style={{
                        marginBottom: 8,
                        height: '50px', // fixed height for title
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {productName}
                </Title>
                <Text type="secondary" style={{ display: 'block' }}>
                    {price}
                </Text>
            </div>
        </Card>
    );
};

export default CardEvent;
