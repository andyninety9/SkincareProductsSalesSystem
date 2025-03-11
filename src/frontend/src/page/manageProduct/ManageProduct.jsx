import { Table, Button, Input, Avatar, Select, Modal, Form, Image, Upload } from "antd";
import { SearchOutlined, StarOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import api from "../../config/api";
import noImg from "../../assets/noimg/noImg.png";
import { toast } from 'react-toastify';

const { Option } = Select;

export default function ManageProduct() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const pageSize = 10;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("Products?page=1&pageSize=1000");
                if (response.data.data && Array.isArray(response.data.data.items)) {
                    setProducts(response.data.data.items);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await api.get("Products/brands?page=1&pageSize=1000");
                if (response.data.data && Array.isArray(response.data.data.items)) {
                    setBrands(response.data.data.items);
                }
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await api.get("Products/categories?page=1&pageSize=1000");
                if (response.data.data && Array.isArray(response.data.data.items)) {
                    setCategories(response.data.data.items);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchProducts();
        fetchBrands();
        fetchCategories();
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log("Product Data:", values);
            setIsModalVisible(false);
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const filteredProducts = products.filter(product =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedBrand ? product.brandName === selectedBrand : true) &&
        (selectedCategory ? product.categoryName === selectedCategory : true)
    );

    const columns = [
        { title: "Product ID", dataIndex: "productId", key: "productId", align: "center" },
        { title: "Product Name", dataIndex: "productName", key: "productName", align: "center" },
        { title: "Description", dataIndex: "productDesc", key: "productDesc", align: "center" },
        { title: "Stock", dataIndex: "stocks", key: "stocks", align: "center" },
        { title: "Cost Price", dataIndex: "costPrice", key: "costPrice", align: "center" },
        { title: "Sell Price", dataIndex: "sellPrice", key: "sellPrice", align: "center" },
        { title: "Brand", dataIndex: "brandName", key: "brandName", align: "center" },
        { title: "Category", dataIndex: "categoryName", key: "categoryName", align: "center" },
        {
            title: "Image",
            dataIndex: "images",
            key: "images",
            align: "center",
            render: (images) =>
                images && images.length > 0
                    ? <Avatar src={images[0]?.prodImageUrl} size={50} />
                    : <Avatar src={noImg} size={50} />,
        }
    ];

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", flexDirection: "column" }}>
            <ManageOrderHeader />
            <div style={{ display: "flex", flex: 1, marginTop: "60px", overflow: "hidden" }}>
                <ManageOrderSidebar />
                <div style={{ flex: 1, padding: "24px", overflowY: "auto", marginLeft: "250px" }}>
                    <h1 style={{ fontSize: "40px", textAlign: "left" }}>Products</h1>

                    <Button type="primary" onClick={showModal} style={{ marginBottom: "20px" }}>Create Product</Button>

                    {/* Filters and Search */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "30px", alignItems:"center" }}>
                        <Select
                            placeholder="Filter by Brand"
                            style={{ width: "200px" }}
                            onChange={value => setSelectedBrand(value)}
                            allowClear
                        >
                            {brands.map(brand => (
                                <Option key={brand.brandId} value={brand.brandName}>{brand.brandName}</Option>
                            ))}
                        </Select>

                        <Select
                            placeholder="Filter by Category"
                            style={{ width: "200px" }}
                            onChange={value => setSelectedCategory(value)}
                            allowClear
                        >
                            {categories.map(category => (
                                <Option key={category.cateProdId} value={category.cateProdName}>{category.cateProdName}</Option>
                            ))}
                        </Select>

                        <Input
                            placeholder="Search for a product..."
                            style={{ width: "450px" }}
                            suffix={<SearchOutlined />}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Products Table */}
                    <Table
                        dataSource={filteredProducts}
                        columns={columns}
                        rowKey="productId"
                        pagination={{
                            position: ["bottomCenter"],
                            current: currentPage,
                            pageSize,
                            total: filteredProducts.length,
                            onChange: setCurrentPage,
                        }}
                        locale={{
                            emptyText: "No data available",
                        }}
                    />

                    {/* Create Product Modal */}
                    <Modal title="Create Product" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                        <Form form={form} layout="vertical">
                            <Form.Item name="productName" label="Product Name" rules={[{ required: true }]}> <Input /> </Form.Item>
                            <Form.Item name="productDesc" label="Description" rules={[{ required: true }]}> <Input /> </Form.Item>
                            <Form.Item name="stocks" label="Stock" rules={[{ required: true }]}> <Input type="number" /> </Form.Item>
                            <Form.Item name="costPrice" label="Cost Price" rules={[{ required: true }]}> <Input type="number" /> </Form.Item>
                            <Form.Item name="sellPrice" label="Sell Price" rules={[{ required: true }]}> <Input type="number" /> </Form.Item>
                            <Form.Item name="brandId" label="Brand" rules={[{ required: true }]}> 
                                <Select>
                                    {brands.map(brand => (
                                        <Option key={brand.brandId} value={brand.brandId}>{brand.brandName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}> 
                                <Select>
                                    {categories.map(category => (
                                        <Option key={category.cateProdId} value={category.cateProdId}>{category.cateProdName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    );
}
