import { Table, Button, Input, Avatar, Select, Modal, Form, Image, Upload, Tooltip } from "antd";
import { SearchOutlined, StarOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import api from "../../config/api";
import noImg from "../../assets/noimg/noImg.png";
import { toast } from 'react-toastify';
import { data } from "react-router-dom";

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
            console.log("✅ Submitted Product Data:", values);
    
            if (!values.productName || !values.productDesc || !values.stocks || !values.costPrice || !values.sellPrice) {
                console.error("❌ Missing required fields");
                return;
            }
    
            // Mapping prodStatusName -> prodStatusId
            const statusMapping = {
                "Available": 1,
                "Out of Stock": 2,
                "Discontinued": 3,
                "Awaiting Restock": 4,
                "On Sale": 5
            };
    
            const requestData = {
                productName: values.productName,
                productDesc: values.productDesc,
                stocks: Number(values.stocks),
                costPrice: Number(values.costPrice),
                sellPrice: Number(values.sellPrice),
                ingredient: values.ingredient || "",
                instruction: values.instruction || "",
                prodUseFor: values.prodUseFor || "",
                brandId: Number(values.brandId),
                cateId: Number(values.categoryId), // API yêu cầu là cateId, không phải categoryId
                prodStatusId: statusMapping[values.prodStatusName] || 1 // Mặc định là "Available"
            };
    
            console.log("📤 Payload to API:", requestData);
    
            // Gửi dữ liệu lên API
            const response = await api.post("Products/create", requestData);
            console.log("✅ Product added successfully:", response.data);
    
            if (response.data.statusCode === 200) {
                toast.success("Product added successfully!");
    
                // **Tạo object sản phẩm mới từ API response**
                const newProduct = {
                    ...requestData,
                    productId: response.data.data.productId,  // Lấy productId từ API
                    brandName: brands.find(b => b.brandId === requestData.brandId)?.brandName || "Unknown",
                    categoryName: categories.find(c => c.cateProdId === requestData.cateId)?.cateProdName || "Unknown",
                    statusName: values.prodStatusName // Lấy tên status từ dropdown
                };
    
                // **Cập nhật bảng, đẩy sản phẩm mới lên đầu**
                setProducts(prevProducts => [newProduct, ...prevProducts]);
    
                setIsModalVisible(false);
                form.resetFields(); // Reset form sau khi thêm thành công
            } else {
                toast.error("Failed to add product. Please try again.");
            }
    
        } catch (error) {
            console.error("❌ API error:", error.response?.data || error.message);
            toast.error(`API Error: ${error.response?.data?.message || "Check console for details"}`);
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
        {
            title: "Product ID",
            dataIndex: "productId",
            key: "productId",
            align: "center",
            width: 100,
            fixed: 'left', 
        },
        {
            title: "Product Name",
            dataIndex: "productName",
            key: "productName",
            align: "center",
            width: 300,  
            render: (productName) => (
                <Tooltip title={productName}>
                    <span style={{
                        maxWidth: "180px", 
                        whiteSpace: "normal",  
                        wordWrap: "break-word", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis"
                    }}>
                        {productName}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: "Description",
            dataIndex: "productDesc",
            key: "productDesc",
            align: "center",
            width: 300,  
            render: (productDesc) => (
                <Tooltip title={productDesc}>
                    <span style={{
                        maxWidth: "180px", 
                        whiteSpace: "normal", 
                        wordWrap: "break-word", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis"
                    }}>
                        {productDesc}
                    </span>
                </Tooltip>
            ),
        },
        
        { title: "Stock", dataIndex: "stocks", key: "stocks", align: "center", width: 100 },
        {
            title: "Cost Price",
            dataIndex: "costPrice",
            key: "costPrice",
            align: "center",
            width: 150,
            render: (costPrice) => (
                <span>
                    {costPrice.toLocaleString("vi-VN")} VND
                </span>
            ),
        },
        {
            title: "Sell Price",
            dataIndex: "sellPrice",
            key: "sellPrice",
            align: "center",
            width: 150,
            render: (sellPrice) => (
                <span>
                    {sellPrice.toLocaleString("vi-VN")} VND
                </span>
            ),
        },
        
        { title: "Brand", dataIndex: "brandName", key: "brandName", align: "center", width: 200 },
        { title: "Category", dataIndex: "categoryName", key: "categoryName", align: "center", width: 200 },
        {
            title: "Ingredient",
            dataIndex: "ingredient",
            key: "ingredient",
            align: "center",
            width: 300,  
            render: (ingredient) => (
                <Tooltip title={ingredient}>
                    <span style={{
                        maxWidth: "180px", 
                        whiteSpace: "normal", 
                        wordWrap: "break-word", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis"
                    }}>
                        {ingredient}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: "Instruction",
            dataIndex: "instruction",
            key: "instruction",
            align: "center",
            width: 300,  
            render: (instruction) => (
                <Tooltip title={instruction}>
                    <span style={{
                        maxWidth: "180px", 
                        whiteSpace: "normal",  
                        wordWrap: "break-word", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis"
                    }}>
                        {instruction}
                    </span>
                </Tooltip>
            ),
        },
        
        {
            title: "Use for",
            dataIndex: "prodUseFor",
            key: "prodUseFor",
            align: "center",
            width: 400, 
            render: (prodUseFor) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    {/* Hiển thị phần ngắn gọn của Use for */}
                    <span style={{
                        maxWidth: "300px", 
                        whiteSpace: "nowrap", 
                        wordWrap: "break-word", 

                        overflow: "hidden", 
                        textOverflow: "ellipsis"
                    }}>
                        {prodUseFor}
                    </span>
                    <Tooltip 
                        title={prodUseFor} 

                    >
                        <Button type="link" style={{ padding: 0, marginLeft: "8px" }}>Xem thêm</Button>
                    </Tooltip>
                </div>
            ),
        },
        
        
        {
            title: "Image",
            dataIndex: "images",
            key: "images",
            align: "center",
            width: 150,
            render: (images) =>
                images && images.length > 0
                    ? <Avatar src={images[0]?.prodImageUrl} size={50} />
                    : <Avatar src={noImg} size={50} />,
        },
        {
            title: "Status",
            dataIndex: "statusName",
            key: "statusName",
            align: "center",
            width: 150,
            render: (statusName) => (
                <span style={{ color: statusName === "Available" ? "green" : "red", fontWeight: "bold" }}>
                    {statusName}
                </span>
            )
        },
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
                    <div style={{ display: "flex", gap: "10px", marginBottom: "30px", alignItems: "center" }}>
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
                        scroll={{ x: 1800 }} // Bảng có thanh cuộn ngang nếu vượt quá 1800px
                        locale={{
                            emptyText: "No data available",
                        }}
                    />


                    {/* Create Product Modal */}
                    <Modal title="Create Product" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                        <Form form={form} layout="vertical">
                            <Form.Item name="productName" label="Product Name" rules={[{ required: true, message: "'productName' is required" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="productDesc" label="Description" rules={[{ required: true, message: "'productDesc' is required" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="stocks" label="Stock" rules={[{ required: true, message: "'stocks' is required" }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="costPrice" label="Cost Price" rules={[{ required: true, message: "'costPrice' is required" }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="sellPrice" label="Sell Price" rules={[{ required: true, message: "'sellPrice' is required" }]}>
                                <Input type="number" />
                            </Form.Item>

                            {/* Thêm 3 mục mới */}
                            <Form.Item name="ingredient" label="Ingredient" rules={[{ required: true, message: "Please enter ingredient details" }]}>
                                <Input.TextArea rows={3} placeholder="Enter ingredient details..." />
                            </Form.Item>
                            <Form.Item name="instruction" label="Instruction" rules={[{ required: true, message: "Please enter instruction details" }]}>
                                <Input.TextArea rows={3} placeholder="Enter instruction details..." />
                            </Form.Item>
                            <Form.Item name="prodUseFor" label="Use for" rules={[{ required: true, message: "Please specify the skin type" }]}>
                                <Input placeholder="e.g. Dry skin, Oily skin, All skin types..." />
                            </Form.Item>
                            <Form.Item name="prodStatusName" label="Status" rules={[{ required: true, message: "Please select a status" }]}>
                                <Select>
                                    <Option value="Available">Available</Option>
                                    <Option value="Out of Stock">Out of Stock</Option>
                                    <Option value="Discontinued">Discontinued</Option>
                                    <Option value="Awaiting Restock">Awaiting Restock</Option>
                                    <Option value="On Sale">On Sale</Option>
                                </Select>
                            </Form.Item>


                            {/* Chọn Brand */}
                            <Form.Item name="brandId" label="Brand" rules={[{ required: true, message: "Please select a brand" }]}>
                                <Select>
                                    {brands.map(brand => (
                                        <Option key={brand.brandId} value={brand.brandId}>{brand.brandName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Chọn Category */}
                            <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
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
