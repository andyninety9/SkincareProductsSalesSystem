/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Modal, Avatar, Tabs, Select, Form, Input, Spin, List, Tag, Button, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import api from '../../config/api';

const { Option } = Select;

const RecommendationModal = ({ isVisible, onOk, onCancel, selectedProduct, productsList }) => {
    const [recFor, setRecFor] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skinTypes, setSkinTypes] = useState([]);
    const [selectedSkinTypeId, setSelectedSkinTypeId] = useState(null);
    const [addingSkinType, setAddingSkinType] = useState(false);

    const handleFetchRecommendFor = async () => {
        if (!selectedProduct || !isVisible) return;

        try {
            setLoading(true);
            const productId = selectedProduct.productId;
            // console.log('Fetching recommendations for product ID:', productId);

            const response = await api.get(`products/recommendation/${productId}?page=1&pageSize=100`);

            if (response.status === 200) {
                const convertedItems = response.data.data.items.map((item) => ({
                    ...item,
                    recForId: BigInt(item.recForId),
                    prodId: BigInt(item.prodId),
                    skinTypeId: BigInt(item.skinTypeId),
                }));

                setRecFor(convertedItems);
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            message.error('Failed to load skin type recommendations');
        } finally {
            setLoading(false);
        }
    };

    const fetchSkinTypes = async () => {
        try {
            const response = await api.get('skintype?page=1&pageSize=50');
            if (response.status === 200) {
                setSkinTypes(response.data.data.items);
            }
        } catch (error) {
            console.error('Error fetching skin types:', error);
            message.error('Failed to load skin types');
        }
    };

    const handleAddSkinType = async () => {
        if (!selectedSkinTypeId) {
            message.warning('Please select a skin type');
            return;
        }

        try {
            setAddingSkinType(true);

            // Check if this skin type is already added
            if (recFor.some((item) => BigInt(item.skinTypeId) === BigInt(selectedSkinTypeId))) {
                message.warning('This skin type is already added');
                return;
            }

            // Convert BigInt values to strings before sending to API
            const response = await api.post('products/recommendation/create', {
                prodId: String(selectedProduct.productId),
                skinTypeId: String(selectedSkinTypeId),
            });

            if (response.status === 200 || response.status === 201) {
                message.success('Skin type recommendation added');
                handleFetchRecommendFor(); // Refresh the list
                setSelectedSkinTypeId(null);
            }
        } catch (error) {
            console.error('Error adding skin type:', error);
            message.error('Failed to add skin type recommendation');
        } finally {
            setAddingSkinType(false);
        }
    };

    const handleDeleteSkinType = async (recForId) => {
        try {
            // Convert BigInt values to strings before sending to API
            const response = await api.delete(`products/recommendation/delete`, {
                data: { recForId: String(recForId) }, // Use 'data' property for DELETE with body
            });

            if (response.status === 200) {
                message.success('Skin type recommendation removed');
                // Update the local state by filtering out the deleted item
                setRecFor(recFor.filter((item) => BigInt(item.recForId) !== BigInt(recForId)));
            }
        } catch (error) {
            console.error('Error removing skin type:', error);
            message.error('Failed to remove skin type recommendation');
        }
    };

    useEffect(() => {
        if (isVisible && selectedProduct) {
            handleFetchRecommendFor();
            fetchSkinTypes();
        }
    }, [isVisible, selectedProduct]);

    return (
        <Modal
            title={`Manage Recommendations for ${selectedProduct?.productName || ''}`}
            visible={isVisible}
            onOk={onOk}
            onCancel={onCancel}
            width={800}>
            {selectedProduct && (
                <div>
                    <div
                        style={{
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                        }}>
                        {selectedProduct.images && selectedProduct.images.length > 0 ? (
                            <Avatar src={selectedProduct.images[0]?.prodImageUrl} size={80} />
                        ) : (
                            <Avatar src="" size={80} />
                        )}
                        <div>
                            <h3 style={{ margin: '0 0 8px 0' }}>{selectedProduct.productName}</h3>
                            <p style={{ margin: '0', color: '#666' }}>
                                ID: {String(selectedProduct.productId)} | Category: {selectedProduct.categoryName}
                            </p>
                        </div>
                    </div>

                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Recommended Skin Types" key="1">
                            <h4>Recommended Skin Types</h4>
                            <p>Add skin types that this product is recommended for:</p>

                            <div style={{ display: 'flex', marginBottom: '20px' }}>
                                <Select
                                    style={{ width: '80%', marginRight: '10px' }}
                                    placeholder="Select a skin type"
                                    value={selectedSkinTypeId}
                                    onChange={setSelectedSkinTypeId}
                                    optionFilterProp="children">
                                    {skinTypes
                                        .filter(
                                            (skinType) =>
                                                !recFor.some(
                                                    (rec) => BigInt(rec.skinTypeId) === BigInt(skinType.skinTypeId)
                                                )
                                        )
                                        .map((skinType) => (
                                            <Option key={String(skinType.skinTypeId)} value={skinType.skinTypeId}>
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {skinType.skinTypeCodes || ''}:
                                                </span>{' '}
                                                {skinType.skinTypeName}
                                            </Option>
                                        ))}
                                </Select>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleAddSkinType}
                                    loading={addingSkinType}
                                    style={{ width: '20%' }}>
                                    Add
                                </Button>
                            </div>

                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <Spin tip="Loading skin type recommendations..." />
                                </div>
                            ) : (
                                <List
                                    bordered
                                    dataSource={recFor}
                                    locale={{ emptyText: 'No skin type recommendations yet' }}
                                    renderItem={(item) => (
                                        <List.Item
                                            actions={[
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleDeleteSkinType(item.recForId)}>
                                                    Remove
                                                </Button>,
                                            ]}>
                                            <Tag color="blue" style={{ padding: '5px 10px', fontSize: '14px' }}>
                                                <span style={{ fontWeight: 'bold' }}>{item.skinTypeCodes || ''}:</span>{' '}
                                                {item.skinTypeName}
                                            </Tag>
                                        </List.Item>
                                    )}
                                />
                            )}
                        </Tabs.TabPane>

                        {/* <Tabs.TabPane tab="Related Products" key="2">
                            <h4>Related Products</h4>
                            <p>Select products that should be shown alongside this product:</p>
                            <Select
                                mode="multiple"
                                style={{ width: '100%', marginBottom: '20px' }}
                                placeholder="Select products to recommend"
                                optionFilterProp="children">
                                {productsList
                                    .filter((p) => p.productId !== selectedProduct.productId)
                                    .map((product) => (
                                        <Option key={String(product.productId)} value={String(product.productId)}>
                                            {product.productName}
                                        </Option>
                                    ))}
                            </Select>
                        </Tabs.TabPane> */}

                        {/* <Tabs.TabPane tab="Display Settings" key="3">
                            <h4>Display Configuration</h4>
                            <p>Configure how recommendations appear on the product page:</p>
                            <Form layout="vertical">
                                <Form.Item label="Max number of recommendations to display">
                                    <Input type="number" defaultValue="4" min="1" max="10" />
                                </Form.Item>
                                <Form.Item label="Recommendation section title">
                                    <Input defaultValue="Customers also bought" />
                                </Form.Item>
                            </Form>
                        </Tabs.TabPane> */}
                    </Tabs>
                </div>
            )}
        </Modal>
    );
};

export default RecommendationModal;
