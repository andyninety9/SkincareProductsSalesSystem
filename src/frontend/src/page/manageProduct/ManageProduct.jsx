// Add these imports at the top
import { Table, Button, Input, Avatar, Select, Modal, Form, Tooltip, message, Upload } from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    SearchOutlined,
    UploadOutlined,
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import ManageOrderSidebar from '../../component/manageOrderSidebar/ManageOrderSidebar';
import ManageOrderHeader from '../../component/manageOrderHeader/ManageOrderHeader';
import api from '../../config/api';
import noImg from '../../assets/noimg/noImg.png';
import { toast } from 'react-toastify';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './ManageProduct.css';
import uploadFile from '../../utils/uploadImages';

const { Option } = Select;

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
export default function ManageProduct() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [totalProducts, setTotalProducts] = useState(0);
    const [selectedBrandId, setSelectedBrandId] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const pageSize = 10;
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const debouncedBrandId = useDebounce(selectedBrandId, 500);
    const debouncedCategoryId = useDebounce(selectedCategoryId, 500);
    const [paginationInfo, setPaginationInfo] = useState({
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [deleteImageLoading, setDeleteImageLoading] = useState(false);

    const ProductSchema = Yup.object().shape({
        productName: Yup.string().required('Product name is required'),
        productDesc: Yup.string().required('Description is required'),
        stocks: Yup.number().required('Stock is required').positive('Must be positive').integer('Must be an integer'),
        costPrice: Yup.number().required('Cost price is required').positive('Must be positive'),
        sellPrice: Yup.number().required('Sell price is required').positive('Must be positive'),
        ingredient: Yup.string().required('Ingredient details are required'),
        instruction: Yup.string().required('Instructions are required'),
        prodUseFor: Yup.string().required('Product usage info is required'),
        brandId: Yup.number().required('Brand is required'),
        categoryId: Yup.number().required('Category is required'),
        prodStatusName: Yup.string().required('Status is required'),
    });

    // Handle image upload
    const handleImageUpload = async (file, productId) => {
        try {
            setImageUploading(true);

            // Step 1: Upload the file to Appwrite storage
            const downloadURL = await uploadFile(file);

            // Step 2: Send the URL to your backend to associate with the product
            const response = await api.post('Products/upload-image', {
                productId: String(productId),
                imageUrl: downloadURL,
            });

            if (response.data.statusCode === 200) {
                // Success message
                message.success('Image uploaded successfully');

                // Refresh product data to show the new image
                refreshProductData();
                return true;
            } else {
                message.error('Failed to associate image with product');
                return false;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            message.error(`Error: ${error.response?.data?.message || 'Failed to upload image'}`);
            return false;
        } finally {
            setImageUploading(false);
        }
    };

    // Handle image deletion
    const handleDeleteImage = async (imageId, productId) => {
        try {
            setDeleteImageLoading(true);

            // Delete image API call
            const response = await api.delete(`products/delete-image`, {
                data: {
                    productId: String(productId),
                    imageId: String(imageId),
                },
            });

            if (response.data.statusCode === 200) {
                message.success('Image deleted successfully');

                // Refresh product data to update the image list
                refreshProductData();
                return true;
            } else {
                message.error('Failed to delete image');
                return false;
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            message.error(`Error: ${error.response?.data?.message || 'Failed to delete image'}`);
            return false;
        } finally {
            setDeleteImageLoading(false);
        }
    };
    // Refresh product data after image changes
    const refreshProductData = async () => {
        try {
            const refreshResponse = await api.get(
                `Products?page=${currentPage}&pageSize=${pageSize}${debouncedSearchTerm ? `&keyword=${debouncedSearchTerm}` : ''
                }${debouncedBrandId ? `&brandId=${debouncedBrandId}` : ''}${debouncedCategoryId ? `&cateId=${debouncedCategoryId}` : ''
                }`
            );

            if (refreshResponse.data.data) {
                const updatedProducts = refreshResponse.data.data.items.map((item) => {
                    return {
                        ...item,
                        productId: BigInt(item.productId),
                        images: item.images.map((img) => {
                            return {
                                ...img,
                                prodImageId: BigInt(img.prodImageId),
                            };
                        }),
                    };
                });

                setProducts(updatedProducts || []);
                setTotalProducts(refreshResponse.data.data.totalItems || 0);
                setPaginationInfo({
                    totalPages: refreshResponse.data.data.totalPages || 0,
                    hasNextPage: refreshResponse.data.data.hasNextPage || false,
                    hasPreviousPage: refreshResponse.data.data.hasPreviousPage || false,
                });
            }
        } catch (error) {
            console.error('Error refreshing product data:', error);
        }
    };

    // Handle product update
    const handleUpdateProduct = async (values, productId) => {
        setUpdateLoading(true);
        try {
            // Status mapping
            const statusMapping = {
                Available: 1,
                'Out of Stock': 2,
                Discontinued: 3,
                'Awaiting Restock': 4,
                'On Sale': 5,
            };

            const updateData = {
                productId: String(productId),
                productName: values.productName,
                productDesc: values.productDesc,
                stocks: Number(values.stocks),
                costPrice: Number(values.costPrice),
                sellPrice: Number(values.sellPrice),
                ingredient: values.ingredient,
                instruction: values.instruction,
                prodUseFor: values.prodUseFor,
                brandId: Number(values.brandId),
                cateId: Number(values.categoryId),
                prodStatusId: statusMapping[values.prodStatusName] || 1,
            };

            const response = await api.patch('products/update', updateData);

            if (response.data.statusCode === 200) {
                message.success('Product updated successfully!');

                // Refresh product list
                const refreshResponse = await api.get(
                    `Products?page=${currentPage}&pageSize=${pageSize}${debouncedSearchTerm ? `&keyword=${debouncedSearchTerm}` : ''
                    }${debouncedBrandId ? `&brandId=${debouncedBrandId}` : ''}${debouncedCategoryId ? `&cateId=${debouncedCategoryId}` : ''
                    }`
                );

                if (refreshResponse.data.data) {
                    setProducts(refreshResponse.data.data.items || []);
                    setTotalProducts(refreshResponse.data.data.totalItems || 0);
                    setPaginationInfo({
                        totalPages: refreshResponse.data.data.totalPages || 0,
                        hasNextPage: refreshResponse.data.data.hasNextPage || false,
                        hasPreviousPage: refreshResponse.data.data.hasPreviousPage || false,
                    });
                }
            } else {
                toast.error('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error(`Error: ${error.response?.data?.message || 'Failed to update product'}`);
        } finally {
            setUpdateLoading(false);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await api.get(
                    `Products?page=${currentPage}&pageSize=${pageSize}${debouncedSearchTerm ? `&keyword=${debouncedSearchTerm}` : ''
                    }${debouncedBrandId ? `&brandId=${debouncedBrandId}` : ''}${debouncedCategoryId ? `&cateId=${debouncedCategoryId}` : ''
                    }`
                );

                if (response.data.data) {
                    var listProduct;
                    listProduct = response.data.data.items.map((item) => {
                        return {
                            ...item,
                            productId: BigInt(item.productId),
                            images: item.images.map((img) => {
                                return {
                                    ...img,
                                    prodImageId: BigInt(img.prodImageId),
                                };
                            }),
                        };
                    });
                    // console.log('📤 Products:', listProduct);

                    setProducts(listProduct || []);
                    setTotalProducts(response.data.data.totalItems || 0);

                    // Store pagination metadata
                    setPaginationInfo({
                        totalPages: response.data.data.totalPages || 0,
                        hasNextPage: response.data.data.hasNextPage || false,
                        hasPreviousPage: response.data.data.hasPreviousPage || false,
                    });
                } else {
                    setProducts([]);
                    setTotalProducts(0);
                    setPaginationInfo({
                        totalPages: 0,
                        hasNextPage: false,
                        hasPreviousPage: false,
                    });
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
                setTotalProducts(0);
                setPaginationInfo({
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, pageSize, debouncedSearchTerm, debouncedBrandId, debouncedCategoryId]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await api.get('Products/brands');
                if (response.data.data && Array.isArray(response.data.data.items)) {
                    setBrands(response.data.data.items);
                }
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await api.get('Products/categories');
                if (response.data.data && Array.isArray(response.data.data.items)) {
                    setCategories(response.data.data.items);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchBrands();
        fetchCategories();
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            // console.log('✅ Submitted Product Data:', values);

            if (
                !values.productName ||
                !values.productDesc ||
                !values.stocks ||
                !values.costPrice ||
                !values.sellPrice
            ) {
                console.error('❌ Missing required fields');
                return;
            }

            // Mapping prodStatusName -> prodStatusId
            const statusMapping = {
                Available: 1,
                'Out of Stock': 2,
                Discontinued: 3,
                'Awaiting Restock': 4,
                'On Sale': 5,
            };

            const requestData = {
                productName: values.productName,
                productDesc: values.productDesc,
                stocks: Number(values.stocks),
                costPrice: Number(values.costPrice),
                sellPrice: Number(values.sellPrice),
                ingredient: values.ingredient || '',
                instruction: values.instruction || '',
                prodUseFor: values.prodUseFor || '',
                brandId: Number(values.brandId),
                cateId: Number(values.categoryId), // API yêu cầu là cateId, không phải categoryId
                prodStatusId: statusMapping[values.prodStatusName] || 1, // Mặc định là "Available"
            };

            // console.log('📤 Payload to API:', requestData);

            // Gửi dữ liệu lên API
            const response = await api.post('Products/create', requestData);
            // console.log('✅ Product added successfully:', response.data);

            if (response.data.statusCode === 200) {
                toast.success('Product added successfully!');

                // Update refresh API call with correct parameters
                const refreshResponse = await api.get(
                    `Products?page=${currentPage}&pageSize=${pageSize}${searchTerm ? `&keyword=${searchTerm}` : ''}${selectedBrandId ? `&brandId=${selectedBrandId}` : ''
                    }${selectedCategoryId ? `&cateId=${selectedCategoryId}` : ''}`
                );

                if (refreshResponse.data.data && Array.isArray(refreshResponse.data.data.items)) {
                    setProducts(refreshResponse.data.data.items);
                    setTotalProducts(refreshResponse.data.data.totalCount || 0);
                } else {
                    // If no items found after adding a product, show empty list
                    setProducts([]);
                    setTotalProducts(0);
                }

                setIsModalVisible(false);
                form.resetFields();
            } else {
                toast.error('Failed to add product. Please try again.');
            }
        } catch (error) {
            console.error('❌ API error:', error.response?.data || error.message);
            toast.error(`API Error: ${error.response?.data?.message || 'Check console for details'}`);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleNextPage = () => {
        if (paginationInfo.hasNextPage) {
            setCurrentPage((prev) => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePreviousPage = () => {
        if (paginationInfo.hasPreviousPage) {
            setCurrentPage((prev) => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const expandedRowRender = (record) => {
        // Find the brandId that matches the record's brandName
        const matchingBrand = brands.find((b) => b.brandName === record.brandName);
        const brandId = matchingBrand ? matchingBrand.brandId : '';

        // Find the categoryId (cateProdId) that matches the record's categoryName
        const matchingCategory = categories.find((c) => c.cateProdName === record.categoryName);
        const categoryId = matchingCategory ? matchingCategory.cateProdId : '';

        // Initial values for Formik with mapped IDs
        const initialValues = {
            productName: record.productName,
            productDesc: record.productDesc,
            stocks: record.stocks,
            costPrice: record.costPrice,
            sellPrice: record.sellPrice,
            ingredient: record.ingredient,
            instruction: record.instruction,
            prodUseFor: record.prodUseFor,
            brandId: brandId, // Use the matched brandId
            categoryId: categoryId, // Use the matched categoryId
            prodStatusName: record.statusName,
        };

        // Custom styling for form fields
        const formFieldStyle = {
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #d9d9d9',
        };

        // Custom error message style
        const errorStyle = {
            color: 'red',
            fontSize: '12px',
            marginTop: '4px',
        };

        // Create a validation schema that doesn't require re-selecting brand & category
        const UpdateProductSchema = Yup.object().shape({
            productName: Yup.string().required('Product name is required'),
            productDesc: Yup.string().required('Description is required'),
            stocks: Yup.number()
                .required('Stock is required')
                .positive('Must be positive')
                .integer('Must be an integer'),
            costPrice: Yup.number().required('Cost price is required').positive('Must be positive'),
            sellPrice: Yup.number().required('Sell price is required').positive('Must be positive'),
            ingredient: Yup.string().required('Ingredient details are required'),
            instruction: Yup.string().required('Instructions are required'),
            prodUseFor: Yup.string().required('Product usage info is required'),
            prodStatusName: Yup.string().required('Status is required'),
            // These fields aren't required to be changed by the user
            brandId: Yup.number(),
            categoryId: Yup.number(),
        });

        return (
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '5px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    {/* Product Images Section */}
                    <div style={{ flex: '0 0 300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Product Images</h3>
                            <span style={{ fontSize: '12px', color: '#666' }}>
                                {record.images?.length || 0}/5 images
                            </span>
                        </div>

                        {/* Display existing images with delete buttons */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                            {record.images && record.images.length > 0 ? (
                                record.images.map((image, idx) => (
                                    <div key={idx} style={{ width: '120px', height: '120px', position: 'relative' }}>
                                        <img
                                            src={image.prodImageUrl}
                                            alt={`${record.productName} - ${idx + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                            }}
                                        />
                                        <Button
                                            danger
                                            type="primary"
                                            icon={<DeleteOutlined />}
                                            size="small"
                                            style={{
                                                position: 'absolute',
                                                top: '5px',
                                                right: '5px',
                                            }}
                                            onClick={() => handleDeleteImage(image.prodImageId, record.productId)}
                                            loading={deleteImageLoading}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div style={{ width: '120px', height: '120px' }}>
                                    <img
                                        src={noImg}
                                        alt="No Image"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                        }}
                                    />
                                </div>
                            )}

                            {/* Upload new image button (if less than 5 images) */}
                            {record.images && record.images.length < 5 && (
                                <Upload
                                    name="image"
                                    listType="picture-card"
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        // Check file type
                                        const isImage = /image\/(jpeg|png|jpg)/.test(file.type);
                                        if (!isImage) {
                                            message.error('You can only upload JPG, JPEG, or PNG image files!');
                                            return Upload.LIST_IGNORE;
                                        }

                                        // Check file size (less than 2MB)
                                        const isLessThan10MB = file.size / 1024 / 1024 < 10;
                                        if (!isLessThan10MB) {
                                            message.error('Image must be smaller than 2MB!');
                                            return Upload.LIST_IGNORE;
                                        }

                                        // Upload the image using our custom function
                                        handleImageUpload(file, record.productId);
                                        return false; // Prevent default upload behavior
                                    }}
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    loading={imageUploading}
                                    disabled={imageUploading}>
                                    {imageUploading ? (
                                        <div>
                                            <div className="ant-spin-dot">
                                                <i className="ant-spin-dot-item"></i>
                                                <i className="ant-spin-dot-item"></i>
                                                <i className="ant-spin-dot-item"></i>
                                                <i className="ant-spin-dot-item"></i>
                                            </div>
                                            <div style={{ marginTop: 8 }}>Uploading...</div>
                                        </div>
                                    ) : (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                            )}
                        </div>

                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                            <p>• Maximum 5 images per product</p>
                            <p>• Images must be less than 2MB</p>
                            <p>• Supported formats: JPG, PNG, JPEG</p>
                        </div>
                    </div>

                    {/* Update Form Section */}
                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px',
                            }}>
                            <h3>Update Product</h3>
                        </div>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={UpdateProductSchema}
                            onSubmit={(values) => handleUpdateProduct(values, record.productId)}>
                            {({ errors, touched, isSubmitting, values }) => (
                                <FormikForm>
                                    <div
                                        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                        {/* Product Name */}
                                        <div>
                                            <label htmlFor="productName">Product Name</label>
                                            <Field name="productName" id="productName" style={formFieldStyle} />
                                            <ErrorMessage name="productName" component="div" style={errorStyle} />
                                        </div>

                                        {/* Stock */}
                                        <div>
                                            <label htmlFor="stocks">Stock</label>
                                            <Field name="stocks" id="stocks" type="number" style={formFieldStyle} />
                                            <ErrorMessage name="stocks" component="div" style={errorStyle} />
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <label htmlFor="prodStatusName">Status</label>
                                            <Field
                                                name="prodStatusName"
                                                id="prodStatusName"
                                                as="select"
                                                style={formFieldStyle}>
                                                <option value="Available">Available</option>
                                                <option value="Out of Stock">Out of Stock</option>
                                                <option value="Discontinued">Discontinued</option>
                                                <option value="Awaiting Restock">Awaiting Restock</option>
                                                <option value="On Sale">On Sale</option>
                                            </Field>
                                            <ErrorMessage name="prodStatusName" component="div" style={errorStyle} />
                                        </div>

                                        {/* Cost Price */}
                                        <div>
                                            <label htmlFor="costPrice">Cost Price</label>
                                            <Field
                                                name="costPrice"
                                                id="costPrice"
                                                type="number"
                                                style={formFieldStyle}
                                            />
                                            <ErrorMessage name="costPrice" component="div" style={errorStyle} />
                                        </div>

                                        {/* Sell Price */}
                                        <div>
                                            <label htmlFor="sellPrice">Sell Price</label>
                                            <Field
                                                name="sellPrice"
                                                id="sellPrice"
                                                type="number"
                                                style={formFieldStyle}
                                            />
                                            <ErrorMessage name="sellPrice" component="div" style={errorStyle} />
                                        </div>

                                        {/* Brand - with current brand highlighted */}
                                        <div>
                                            <label htmlFor="brandId">Brand</label>
                                            <Field name="brandId" id="brandId" as="select" style={formFieldStyle}>
                                                {brands.map((brand) => (
                                                    <option key={brand.brandId} value={brand.brandId}>
                                                        {brand.brandName}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="brandId" component="div" style={errorStyle} />
                                        </div>

                                        {/* Category - with current category highlighted */}
                                        <div>
                                            <label htmlFor="categoryId">Category</label>
                                            <Field name="categoryId" id="categoryId" as="select" style={formFieldStyle}>
                                                {categories.map((category) => (
                                                    <option key={category.cateProdId} value={category.cateProdId}>
                                                        {category.cateProdName}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="categoryId" component="div" style={errorStyle} />
                                        </div>
                                    </div>

                                    {/* Description and other fields remain the same */}
                                    <div style={{ marginTop: '16px' }}>
                                        <label htmlFor="productDesc">Description</label>
                                        <Field
                                            name="productDesc"
                                            id="productDesc"
                                            as="textarea"
                                            style={{ ...formFieldStyle, height: '60px' }}
                                        />
                                        <ErrorMessage name="productDesc" component="div" style={errorStyle} />
                                    </div>

                                    <div style={{ marginTop: '16px' }}>
                                        <label htmlFor="ingredient">Ingredient</label>
                                        <Field
                                            name="ingredient"
                                            id="ingredient"
                                            as="textarea"
                                            style={{ ...formFieldStyle, height: '80px' }}
                                        />
                                        <ErrorMessage name="ingredient" component="div" style={errorStyle} />
                                    </div>

                                    <div style={{ marginTop: '16px' }}>
                                        <label htmlFor="instruction">Instruction</label>
                                        <Field
                                            name="instruction"
                                            id="instruction"
                                            as="textarea"
                                            style={{ ...formFieldStyle, height: '80px' }}
                                        />
                                        <ErrorMessage name="instruction" component="div" style={errorStyle} />
                                    </div>

                                    <div style={{ marginTop: '16px' }}>
                                        <label htmlFor="prodUseFor">Use for</label>
                                        <Field
                                            name="prodUseFor"
                                            id="prodUseFor"
                                            as="textarea"
                                            style={{ ...formFieldStyle, height: '60px' }}
                                        />
                                        <ErrorMessage name="prodUseFor" component="div" style={errorStyle} />
                                    </div>

                                    <div style={{ marginTop: '20px' }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={updateLoading || isSubmitting}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </FormikForm>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        );
    };

    const columns = [
        {
            title: 'Product ID',
            dataIndex: 'productId',
            key: 'productId',
            align: 'center',
            width: 100,
            fixed: 'left',
            render: (productId) => String(productId),
        },
        {
            title: 'Image',
            dataIndex: 'images',
            key: 'images',
            align: 'center',
            width: 150,
            render: (images) =>
                images && images.length > 0 ? (
                    <Avatar src={images[0]?.prodImageUrl} size={50} />
                ) : (
                    <Avatar src={noImg} size={50} />
                ),
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
            align: 'center',
            width: 300,
            render: (productName) => (
                <Tooltip title={productName}>
                    <span
                        style={{
                            maxWidth: '180px',
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                        {productName}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'statusName',
            key: 'statusName',
            align: 'center',
            width: 150,
            render: (statusName) => (
                <span style={{ color: statusName === 'Available' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {statusName}
                </span>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'productDesc',
            key: 'productDesc',
            align: 'center',
            width: 300,
            render: (productDesc) => (
                <Tooltip title={productDesc}>
                    <span
                        style={{
                            maxWidth: '180px',
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                        {productDesc}
                    </span>
                </Tooltip>
            ),
        },

        { title: 'Stock', dataIndex: 'stocks', key: 'stocks', align: 'center', width: 100 },
        {
            title: 'Cost Price',
            dataIndex: 'costPrice',
            key: 'costPrice',
            align: 'center',
            width: 150,
            render: (costPrice) => <span>{costPrice.toLocaleString('vi-VN')} VND</span>,
        },
        {
            title: 'Sell Price',
            dataIndex: 'sellPrice',
            key: 'sellPrice',
            align: 'center',
            width: 150,
            render: (sellPrice) => <span>{sellPrice.toLocaleString('vi-VN')} VND</span>,
        },

        { title: 'Brand', dataIndex: 'brandName', key: 'brandName', align: 'center', width: 200 },
        { title: 'Category', dataIndex: 'categoryName', key: 'categoryName', align: 'center', width: 200 },
        {
            title: 'Ingredient',
            dataIndex: 'ingredient',
            key: 'ingredient',
            align: 'center',
            width: 300,
            render: (ingredient) => (
                <Tooltip title={ingredient}>
                    <span
                        style={{
                            maxWidth: '180px',
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                        {ingredient}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: 'Instruction',
            dataIndex: 'instruction',
            key: 'instruction',
            align: 'center',
            width: 300,
            render: (instruction) => (
                <Tooltip title={instruction}>
                    <span
                        style={{
                            maxWidth: '180px',
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                        {instruction}
                    </span>
                </Tooltip>
            ),
        },

        {
            title: 'Use for',
            dataIndex: 'prodUseFor',
            key: 'prodUseFor',
            align: 'center',
            width: 400,
            render: (prodUseFor) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Hiển thị phần ngắn gọn của Use for */}
                    <span
                        style={{
                            maxWidth: '300px',
                            whiteSpace: 'nowrap',
                            wordWrap: 'break-word',

                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                        {prodUseFor}
                    </span>
                    <Tooltip title={prodUseFor}>
                        <Button type="link" style={{ padding: 0, marginLeft: '8px' }}>
                            Xem thêm
                        </Button>
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', flexDirection: 'column' }}>
            <ManageOrderHeader />
            <div style={{ display: 'flex', flex: 1, marginTop: '60px', overflow: 'hidden' }}>
                <ManageOrderSidebar />
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', marginLeft: '250px' }}>
                    <h1 style={{ fontSize: '40px', textAlign: 'left' }}>Products</h1>

                    <Button
                        type="primary"
                        onClick={showModal}
                        style={{ marginBottom: '20px', backgroundColor: '#D8959A', borderColor: '#D8959A' }}>
                        Create Product
                    </Button>


                    {/* Filters and Search */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', alignItems: 'center' }}>
                        <Select
                            placeholder="Filter by Brand"
                            style={{ width: '200px' }}
                            onChange={(value) => {
                                setSelectedBrandId(value);
                                setCurrentPage(1);
                            }}
                            allowClear>
                            {brands.map((brand) => (
                                <Option key={brand.brandId} value={brand.brandId}>
                                    {brand.brandName}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            placeholder="Filter by Category"
                            style={{ width: '200px' }}
                            onChange={(value) => {
                                setSelectedCategoryId(value);
                                setCurrentPage(1);
                            }}
                            allowClear>
                            {categories.map((category) => (
                                <Option key={category.cateProdId} value={category.cateProdId}>
                                    {category.cateProdName}
                                </Option>
                            ))}
                        </Select>

                        <Input
                            placeholder="Search for a product..."
                            style={{ width: '450px' }}
                            suffix={<SearchOutlined />}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    {/* Products Table */}
                    <Table
                        dataSource={products}
                        columns={columns}
                        rowKey="productId"
                        loading={loading}
                        expandable={{
                            expandedRowRender,
                            expandRowByClick: true,
                            onExpand: (expanded, record) => {
                                setExpandedRowKeys(expanded ? [record.productId] : []);
                            },
                            expandedRowKeys: expandedRowKeys,
                        }}
                        pagination={{
                            position: ['bottomCenter'],
                            current: currentPage,
                            pageSize: pageSize,
                            total: totalProducts,
                            itemRender: (page, type, originalElement) => {
                                if (type === 'prev') {
                                    return (
                                        <Button disabled={!paginationInfo.hasPreviousPage} onClick={handlePreviousPage}>
                                            <LeftOutlined />
                                        </Button>
                                    );
                                }
                                if (type === 'next') {
                                    return (
                                        <Button disabled={!paginationInfo.hasNextPage} onClick={handleNextPage}>
                                            <RightOutlined />
                                        </Button>
                                    );
                                }
                                return originalElement;
                            },
                            onChange: (page) => {
                                setCurrentPage(page);
                                window.scrollTo(0, 0);
                                // Close any expanded rows when changing page
                                setExpandedRowKeys([]);
                            },
                            showSizeChanger: false,
                        }}
                        scroll={{ x: 1800 }}
                        locale={{
                            emptyText: 'No data available',
                        }}
                    />

                    {/* Create Product Modal */}
                    <Modal title="Create Product" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="productName"
                                label="Product Name"
                                rules={[{ required: true, message: "'productName' is required" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="productDesc"
                                label="Description"
                                rules={[{ required: true, message: "'productDesc' is required" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="stocks"
                                label="Stock"
                                rules={[{ required: true, message: "'stocks' is required" }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item
                                name="costPrice"
                                label="Cost Price"
                                rules={[{ required: true, message: "'costPrice' is required" }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item
                                name="sellPrice"
                                label="Sell Price"
                                rules={[{ required: true, message: "'sellPrice' is required" }]}>
                                <Input type="number" />
                            </Form.Item>

                            {/* Thêm 3 mục mới */}
                            <Form.Item
                                name="ingredient"
                                label="Ingredient"
                                rules={[{ required: true, message: 'Please enter ingredient details' }]}>
                                <Input.TextArea rows={3} placeholder="Enter ingredient details..." />
                            </Form.Item>
                            <Form.Item
                                name="instruction"
                                label="Instruction"
                                rules={[{ required: true, message: 'Please enter instruction details' }]}>
                                <Input.TextArea rows={3} placeholder="Enter instruction details..." />
                            </Form.Item>
                            <Form.Item
                                name="prodUseFor"
                                label="Use for"
                                rules={[{ required: true, message: 'Please specify the skin type' }]}>
                                <Input placeholder="e.g. Dry skin, Oily skin, All skin types..." />
                            </Form.Item>
                            <Form.Item
                                name="prodStatusName"
                                label="Status"
                                rules={[{ required: true, message: 'Please select a status' }]}>
                                <Select>
                                    <Option value="Available">Available</Option>
                                    <Option value="Out of Stock">Out of Stock</Option>
                                    <Option value="Discontinued">Discontinued</Option>
                                    <Option value="Awaiting Restock">Awaiting Restock</Option>
                                    <Option value="On Sale">On Sale</Option>
                                </Select>
                            </Form.Item>

                            {/* Chọn Brand */}
                            <Form.Item
                                name="brandId"
                                label="Brand"
                                rules={[{ required: true, message: 'Please select a brand' }]}>
                                <Select>
                                    {brands.map((brand) => (
                                        <Option key={brand.brandId} value={brand.brandId}>
                                            {brand.brandName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Chọn Category */}
                            <Form.Item
                                name="categoryId"
                                label="Category"
                                rules={[{ required: true, message: 'Please select a category' }]}>
                                <Select>
                                    {categories.map((category) => (
                                        <Option key={category.cateProdId} value={category.cateProdId}>
                                            {category.cateProdName}
                                        </Option>
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
