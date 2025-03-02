import { useEffect, useState } from 'react';
import { Select } from 'antd'; // Thêm Carousel từ antd
import Button from '../../component/button/Button.jsx';
import CardProduct from '../../component/cardProduct/card.jsx';
import CustomPagination from '../../component/pagination/CustomPagination.jsx';
import api from '../../config/api.jsx';
import banner from '../../assets/banner.jpg';
import './ProductPage.scss';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import drnt from '../../assets/baumanIMG/drnt.png';
import drnw from '../../assets/baumanIMG/drnw.png';
import drpt from '../../assets/baumanIMG/drpt.png';
import drpw from '../../assets/baumanIMG/drpw.png';
import dsnt from '../../assets/baumanIMG/dsnt.png';
import dsnw from '../../assets/baumanIMG/dsnw.png';
import dspt from '../../assets/baumanIMG/dspt.png';
import dspw from '../../assets/baumanIMG/dspw.png';
import ornt from '../../assets/baumanIMG/ornt.png';
import ornw from '../../assets/baumanIMG/ornw.png';
import orpt from '../../assets/baumanIMG/orpt.png';
import orpw from '../../assets/baumanIMG/orpw.png';
import osnt from '../../assets/baumanIMG/osnt.png';
import osnw from '../../assets/baumanIMG/osnw.png';
import ospt from '../../assets/baumanIMG/ospt.png';
import ospw from '../../assets/baumanIMG/ospw.png';

const images = [
    { src: drnt, name: 'DRNT' },
    { src: drnw, name: 'DRNW' },
    { src: drpt, name: 'DRPT' },
    { src: drpw, name: 'DRPW' },
    { src: dsnt, name: 'DSNT' },
    { src: dsnw, name: 'DSNW' },
    { src: dspt, name: 'DSPT' },
    { src: dspw, name: 'DSPW' },
    { src: ornt, name: 'ORNT' },
    { src: ornw, name: 'ORNW' },
    { src: orpt, name: 'ORPT' },
    { src: orpw, name: 'ORPW' },
    { src: osnt, name: 'OSNT' },
    { src: osnw, name: 'OSNW' },
    { src: ospt, name: 'OSPT' },
    { src: ospw, name: 'OSPW' },
];

export default function ProductPage() {
    const [page, setPage] = useState(1);
    const pageSize = 12;
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brandFilter, setBrandFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    // const [skinTypeFilter, setSkinTypeFilter] = useState('');

    const fetchProduct = async () => {
        try {
            const response = await api.get('Products');
            console.log('API Response:', response.data.data.items);

            if (response.data && response.data.data.items && Array.isArray(response.data.data.items)) {
                setProducts(response.data.data.items);
                setFilteredProducts(response.data.data.items);

                const uniqueBrands = [...new Set(response.data.data.items.map((item) => item.brandName))];
                const uniqueCategories = [...new Set(response.data.data.items.map((item) => item.categoryName))];
                setBrands(uniqueBrands);
                setCategories(uniqueCategories);
            } else {
                console.error('❌ Invalid API response format:', response.data);
                setProducts([]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm:', error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    const handleFilter = () => {
        let filtered = products;
        if (brandFilter) {
            filtered = filtered.filter((product) => product.brandName === brandFilter);
        }
        if (categoryFilter) {
            filtered = filtered.filter((product) => product.categoryName === categoryFilter);
        }

        setFilteredProducts(filtered);
        setPage(1);
    };

    const displayedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

    const [currentIndex, setCurrentIndex] = useState(0); // State để điều khiển ảnh hiện tại

    const nextImage = () => {
        if (currentIndex + 4 < images.length) {
            setCurrentIndex(currentIndex + 4); // Chuyển tới nhóm ảnh tiếp theo
        }
    };

    const prevImage = () => {
        if (currentIndex - 4 >= 0) {
            setCurrentIndex(currentIndex - 4); // Quay lại nhóm ảnh trước đó
        }
    };

    return (
        <div className="product-page" style={{ margin: '0', maxWidth: '100%' }}>
            <div className="banner" style={{ position: 'relative', textAlign: 'center' }}>
                <img src={banner} alt="Banner" style={{ width: '100%', objectFit: 'cover' }} />
                <h2
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        color: 'white',
                        fontSize: '30px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                    }}>
                    Sản phẩm
                </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1% 5%' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                    {/* Mũi tên trái */}
                    <button
                        onClick={prevImage}
                        style={{
                            cursor: 'pointer',
                            padding: '10px 15px',
                            border: 'none',
                            transition: 'all 0.3s ease',
                            backgroundColor: 'transparent',
                        }}>
                        <LeftOutlined style={{ fontSize: '15px', color: 'black', fontWeight: 'bold' }} />
                    </button>
                    {/* Hiển thị 4 ảnh với tên */}
                    <div style={{ display: 'flex', gap: '20px', transition: 'all 0.5s ease' }}>
                        {images.slice(currentIndex, currentIndex + 4).map((img, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <img
                                    src={img.src}
                                    alt={`image${index}`}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease', // Thêm hiệu ứng mượt mà
                                    }}
                                    onMouseEnter={(e) => (e.target.style.transform = 'scale(2.0)')} // Phóng to khi hover
                                    onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')} // Quay lại bình thường khi rời chuột
                                />
                                <p style={{ marginTop: '8px', fontSize: '13px' }}>{img.name}</p>
                            </div>
                        ))}
                    </div>

                    {/* Mũi tên phải */}
                    <button
                        onClick={nextImage}
                        style={{
                            cursor: 'pointer',
                            padding: '10px 15px',
                            border: 'none',
                            transition: 'all 0.3s ease',
                            backgroundColor: 'transparent',
                        }}>
                        <RightOutlined style={{ fontSize: '15px', color: 'black', fontWeight: 'bold' }} />
                    </button>
                </div>
                <div
                    className="filters"
                    style={{
                        display: 'flex',
                        gap: '15px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                    }}>
                    <Select
                        style={{ width: '200px' }}
                        placeholder="Chọn thương hiệu"
                        options={brands.map((brand) => ({ label: brand, value: brand }))}
                        onChange={(value) => setBrandFilter(value)}
                        allowClear
                    />
                    <Select
                        style={{ width: '200px' }}
                        placeholder="Chọn danh mục"
                        options={categories.map((category) => ({ label: category, value: category }))}
                        onChange={(value) => setCategoryFilter(value)}
                        allowClear
                    />
                    <Button
                        text="Lọc"
                        onClick={handleFilter}
                        style={{ backgroundColor: '#D8959A', color: 'white', padding: '8px 16px' }}
                    />
                </div>
            </div>

            {displayedProducts.length === 0 ? (
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ textAlign: 'center', fontSize: '18px', color: '#D8959A', fontWeight: 'bold' }}>
                        Không tìm thấy sản phẩm phù hợp.
                    </p>
                </div>
            ) : (
                <>
                    <div
                        className="product-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '20px',
                            justifyContent: 'center',
                        }}>
                        {displayedProducts.map((product) => (
                            <CardProduct key={product.id} product={product} />
                        ))}
                    </div>
                    <div style={{ marginTop: '30px', textAlign: 'center' }}>
                        <CustomPagination
                            currentPage={page}
                            totalItems={filteredProducts.length}
                            pageSize={pageSize}
                            onPageChange={setPage}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
