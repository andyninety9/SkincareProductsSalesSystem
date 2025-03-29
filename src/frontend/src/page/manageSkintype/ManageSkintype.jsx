import { Table, Button, Input, Card, message, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import { useState, useEffect } from "react";
import api from '../../config/api';

export default function ManageSkintype() {
    const [skintypeItems, setSkintypeItems] = useState([]);
    const [visibleItems, setVisibleItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const pageSize = 10;

    const fetchSkintypeItems = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`Skintype?page=${page}&pageSize=${pageSize}`);
            console.log('API Response:', response);

            if (response.status !== 200) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const skintypeData = response.data.data?.items || [];
            const formattedItems = Array.isArray(skintypeData)
                ? skintypeData.map((item) => ({
                    skinTypeId: item.skinTypeId,
                    skinTypeCodes: item.skinTypeCodes || "N/A",
                    skinTypeName: item.skinTypeName || "N/A",
                    skinTypeDesc: item.skinTypeDesc || "N/A",
                }))
                : [];
            setSkintypeItems(formattedItems);
            setTotal(response.data.data?.totalItems || formattedItems.length);
        } catch (error) {
            console.error('Error fetching skintype items:', error);
            console.error('Response data (if available):', error.response?.data);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch skintype items';
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkintypeItems(currentPage);
    }, [currentPage]);

    const toggleVisibility = (skinTypeId) => {
        setVisibleItems((prev) => ({
            ...prev,
            [skinTypeId]: !prev[skinTypeId],
        }));
    };

    const columns = [
        {
            title: "Skin Type ID",
            dataIndex: "skinTypeId",
            key: "skinTypeId",
            width: 200,
            align: "center"
        },
        {
            title: "Skin Type Codes",
            dataIndex: "skinTypeCodes",
            key: "skinTypeCodes",
            width: 250,
            align: "center"
        },
        {
            title: "Skin Type Name",
            dataIndex: "skinTypeName",
            key: "skinTypeName",
            width: 400
        },
    ];

    const expandableConfig = {
        expandedRowRender: (record) => {
            return (
                <div className="expanded-row-content" style={{ padding: "16px" }}>
                    <div style={{ marginBottom: "16px" }}>
                        <strong>Mô tả:</strong>
                        <p>{record.skinTypeDesc}</p>
                    </div>
                </div>
            );
        },
        rowExpandable: () => true,
        onExpand: (expanded, record) => toggleVisibility(record.skinTypeId),
    };

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", flexDirection: "column" }}>
            <div>
                <ManageOrderHeader />
            </div>
            <div style={{ display: "flex", flex: 1, marginTop: "60px", overflow: "hidden" }}>
                <div>
                    <ManageOrderSidebar />
                </div>
                <div
                    style={{
                        flex: 1,
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        overflowY: "auto",
                        marginLeft: "250px"
                    }}
                >
                    <div style={{ width: "100%", margin: "0" }}>
                        <h1 style={{ fontSize: "40px", textAlign: "left", width: "100%", marginBottom: "16px" }}>
                            Skintypes
                        </h1>
                        {error && (
                            <div style={{ color: "red", marginBottom: "16px", width: "100%" }}>
                                Error: {error}
                            </div>
                        )}
                        <div style={{ display: "flex", gap: "70px", marginBottom: "16px", justifyContent: "flex-start", width: "100%" }}>
                            <Card
                                style={{
                                    textAlign: "left",
                                    width: "250px",
                                    backgroundColor: "#FFFCFC",
                                    height: "120px",
                                    borderRadius: "12px",
                                    padding: "16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                }}
                            >
                                <h2 style={{ fontSize: "18px", fontFamily: "Nunito, sans-serif", margin: 0 }}>
                                    Total Skintypes
                                </h2>
                                <p
                                    style={{
                                        fontSize: "25px",
                                        color: "#C87E83",
                                        fontFamily: "Nunito, sans-serif",
                                        margin: 0
                                    }}
                                >
                                    {total}
                                </p>
                            </Card>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                marginBottom: "30px",
                                marginTop: "30px",
                                width: "100%"
                            }}
                        >
                            <Input
                                placeholder="Search skin types ..."
                                style={{ width: "650px" }}
                                suffix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
                            />
                        </div>
                        <div style={{ width: "100%" }}>
                            <Table
                                dataSource={skintypeItems}
                                columns={columns}
                                rowKey="skinTypeId"
                                loading={loading}
                                pagination={false}
                                expandable={expandableConfig}
                                className="manage-skintype-table"
                                style={{ width: "100%" }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "16px",
                                    width: "100%"
                                }}
                            >
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={total}
                                    onChange={(page) => setCurrentPage(page)}
                                    showSizeChanger={false}
                                    position={['bottomCenter']}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}