import { Table, Button, Input, Avatar, Select, Upload, Image } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import api from "../../config/api";
import noImg from "../../assets/noimg/noImg.png";
import uploadFile from "../../utils/uploadImages";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const { Option } = Select;

export default function ManageProduct() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const pageSize = 10;


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("Products?page=1&pageSize=1000");
                console.log("Fetched Products:", response.data);

                if (response.data.data && Array.isArray(response.data.data.items)) {
                    setProducts(response.data.data.items);
                } else {
                    console.error("Invalid API response format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => 
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedBrand ? product.brandName === selectedBrand : true) &&
        (selectedCategory ? product.categoryName === selectedCategory : true)
    );

    const brands = [...new Set(products.map(product => product.brandName))];
    const categories = [...new Set(products.map(product => product.categoryName))];

    const columns = [
        { title: "Product ID", dataIndex: "productId", key: "productId", align: "center" },
        { title: "Product Name", dataIndex: "productName", key: "productName", align: "center" },
        { title: "Description", dataIndex: "productDesc", key: "productDesc", align: "center" },
        { title: "Stock", dataIndex: "stocks", key: "stocks", align: "center" },
        { title: "Cost Price", dataIndex: "costPrice", key: "costPrice", align: "center" },
        { title: "Sell Price", dataIndex: "sellPrice", key: "sellPrice", align: "center" },
        { title: "Total Rating", dataIndex: "totalRating", key: "totalRating", align: "center" },
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
        },
        {
            title: "Status",
            dataIndex: "statusName",
            key: "statusName",
            align: "center",
            render: (status) => (
                <Button style={{ backgroundColor: status === "Available" ? "#28A745" : "#DC3545", borderRadius: "12px", width: "120px", color: "white" }}>
                    {status}
                </Button>
            ),
        },
    ];

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", flexDirection: "column" }}>




            <ManageOrderHeader />
            <div style={{ display: "flex", flex: 1, marginTop: "60px", overflow: "hidden" }}>
                <ManageOrderSidebar />
                <div style={{ flex: 1, padding: "24px", overflowY: "auto", marginLeft: "250px" }}>
                    <h1 style={{ fontSize: "40px", textAlign: "left" }}>Products</h1>

                    {/* Filters and Search */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "30px", alignItems:"center" }}>
                        <Select
                            placeholder="Filter by Brand"
                            style={{ width: "200px", borderRadius: "12px" }}
                            onChange={value => setSelectedBrand(value)}
                            allowClear
                        >
                            {brands.map(brand => (
                                <Option key={brand} value={brand}>{brand}</Option>
                            ))}
                        </Select>

                        <Select
                            placeholder="Filter by Category"
                            style={{ width: "200px", borderRadius: "12px" }}
                            onChange={value => setSelectedCategory(value)}
                            allowClear
                        >
                            {categories.map(category => (
                                <Option key={category} value={category}>{category}</Option>
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
                </div>
            </div>
        </div>
    );
}
