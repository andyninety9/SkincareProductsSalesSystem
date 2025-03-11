import { Table, Button, Image, Upload, Modal } from "antd";
import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../config/api";
import { toast } from "react-toastify";
import uploadFile from "../../utils/uploadImages";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";

export default function ManageImgProduct({ productId }) {
    const [images, setImages] = useState([]);
    const [productName, setProductName] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await api.get(`Products`);
                if (response.data && response.data.items) {
                    const product = response.data.items.find(item => item.productId === productId);
                    if (product) {
                        setImages(product.images || []);
                        setProductName(product.productName);
                    }
                }
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };
        fetchImages();
    }, [productId]);

    const handleUpload = async () => {
        try {
            const uploadedImages = await Promise.all(
                fileList.map(async (file) => {
                    const url = await uploadFile(file.originFileObj);
                    return { prodImageUrl: url };
                })
            );
            
            await api.post(`Products/${productId}/Images`, { images: uploadedImages });
            toast.success("Upload thành công!");
            setImages([...images, ...uploadedImages]);
            setFileList([]);
            setIsModalVisible(false);
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Upload thất bại!");
        }
    };

    const handleDelete = async (imageId) => {
        try {
            await api.delete(`Products/${productId}/Images/${imageId}`);
            setImages(images.filter(img => img.prodImageId !== imageId));
            toast.success("Xóa ảnh thành công!");
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Xóa ảnh thất bại!");
        }
    };

    const columns = [
        {
            title: "Product ID",
            dataIndex: "productId",
            key: "productId",
            render: () => productId,
        },
        {
            title: "Product Name",
            dataIndex: "productName",
            key: "productName",
            render: () => productName,
        },
        {
            title: "Image",
            dataIndex: "prodImageUrl",
            key: "prodImageUrl",
            render: (url) => <Image src={url} width={100} height={100} />, 
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Button type="danger" onClick={() => handleDelete(record.prodImageId)}>Delete</Button>
            ),
        },
    ];

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", flexDirection: "column" }}>
            <ManageOrderHeader />
            <div style={{ display: "flex", flex: 1, marginTop: "60px", overflow: "hidden" }}>
                <ManageOrderSidebar />
                <div style={{ flex: 1, padding: "24px", overflowY: "auto", marginLeft: "250px" }}>
                    <h2>Manage Product Images</h2>
                    <Button type="primary" style={{ backgroundColor: "#D8959A", borderColor: "#D8959A" }} onClick={() => setIsModalVisible(true)}>Upload Images</Button>
                    <Table dataSource={images} columns={columns} rowKey="prodImageId" style={{ marginTop: 20 }} />

                    <Modal
                        title="Upload Images"
                        visible={isModalVisible}
                        onOk={handleUpload}
                        onCancel={() => setIsModalVisible(false)}
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Select Images</Button>
                        </Upload>
                    </Modal>
                </div>
            </div>
        </div>
    );
}
