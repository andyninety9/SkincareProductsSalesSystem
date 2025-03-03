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

export default function ProductPage() {
    const [page, setPage] = useState(1);
    const pageSize = 12;
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brandFilter, setBrandFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [skinTypes, setSkinTypes] = useState([]);
    const [skinTypeMap, setSkinTypeMap] = useState({});
    const [skinTypeId, setSkinTypeId] = useState();

    const skinTypeImages = {
        OSPW: ospw, // 1
        OSPT: ospt, // 2
        OSNW: osnw, // 3
        OSNT: osnt, // 4
        ORPW: orpw, // 5
        ORPT: orpt, // 6
        ORNW: ornw, // 7
        ORNT: ornt, // 8
        DSPW: dspw, // 9
        DSPT: dspt, // 10
        DSNW: dsnw, // 11
        DSNT: dsnt, // 12
        DRPW: drpw, // 13
        DRPT: drpt, // 14
        DRNW: drnw, // 15
        DRNT: drnt, // 16
    };

    const fetchSkinTypes = async () => {
        try {
            const response = await api.get('skintype', { params: { pageSize: 10000 } });

            if (response.data?.data?.items) {
                // Sắp xếp theo skinTypeId từ 1 -> 16
                const sortedSkinTypes = response.data.data.items.sort((a, b) => a.skinTypeId - b.skinTypeId);
                setSkinTypes(sortedSkinTypes);

                // Mapping skinTypeCodes với hình ảnh chính xác
                const mappedSkinTypes = {};
                sortedSkinTypes.forEach((skinType) => {
                    mappedSkinTypes[skinType.skinTypeCodes] = skinTypeImages[skinType.skinTypeCodes] || null;
                });

                setSkinTypeMap(mappedSkinTypes);
                // console.log('🎉 Loại da sau khi sắp xếp:', sortedSkinTypes);
            } else {
                console.error('❌ API trả về không hợp lệ:', response.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy loại da:', error);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await api.get('products', {
                params: {
                    keyword: '',
                    cateID: '',
                    brandID: '',
                    skinTypeId: skinTypeId || '',
                    pageSize: 10000,
                    page: page || 1,
                },
            });

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
        fetchSkinTypes();
        fetchProduct();
    }, [skinTypeId]);

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

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 4 < Object.keys(skinTypeMap).length ? prevIndex + 4 : 0));
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex - 4 >= 0 ? prevIndex - 4 : Math.max(Object.keys(skinTypeMap).length - 4, 0)
        );
    };

    return (
        <div className="product-page" style={{ margin: '0', maxWidth: '1440px' }}>
            <div className="banner" style={{ position: 'relative', textAlign: 'center' }}>
                <img src={banner} alt="Banner" style={{ width: '100%', objectFit: 'cover', height: 'fit-content' }} />
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
                        {skinTypes
                            .sort((a, b) => a.skinTypeId - b.skinTypeId) // 🔥 Sắp xếp đúng thứ tự skinTypeId từ 1-16
                            .slice(currentIndex, currentIndex + 4) // 🔥 Chỉ lấy 4 hình ảnh mỗi lần
                            .map((skinType, index) => (
                                <div key={index} style={{ textAlign: 'center' }}>
                                    <img
                                        src={skinTypeMap[skinType.skinTypeCodes]} // 🔥 Hiển thị đúng ảnh
                                        alt={skinType.skinTypeCodes}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            transition:
                                                'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
                                            background: skinType.skinTypeId === skinTypeId ? 'transparent' : 'white', // 🔥 Loại bỏ nền trắng khi chọn
                                            boxShadow:
                                                skinType.skinTypeId === skinTypeId
                                                    ? '0 0 15px rgba(216, 149, 154, 0.5)' // 🔥 Đổ bóng nhẹ khi chọn
                                                    : 'none',
                                            transform:
                                                skinType.skinTypeId === skinTypeId
                                                    ? 'scale(1.2)' // 🔥 Phóng to nhẹ khi chọn
                                                    : 'scale(1)',
                                            borderRadius: '8px', // 🔥 Giữ viền mềm mại khi hover
                                        }}
                                        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.3)')} // Phóng to khi hover
                                        onMouseLeave={(e) => {
                                            e.target.style.transform =
                                                skinType.skinTypeId === skinTypeId ? 'scale(1.2)' : 'scale(1)';
                                        }} // Giữ hiệu ứng khi đang chọn
                                        onClick={() => {
                                            if (skinType.skinTypeId === skinTypeId) {
                                                setSkinTypeId(''); // 🔥 Nếu bấm lại vào lựa chọn đã chọn => Reset về ''
                                                // console.log('🔄 Reset bộ lọc loại da');
                                            } else {
                                                setSkinTypeId(skinType.skinTypeId); // 🔥 Chỉ cập nhật nếu chọn loại da mới
                                                // console.log(
                                                //     '🎉 Loại da được chọn:',
                                                //     skinType.skinTypeCodes,
                                                //     skinType.skinTypeId
                                                // );
                                            }
                                        }}
                                    />
                                    <p
                                        style={{
                                            marginTop: '8px',
                                            fontSize: '13px',
                                            fontWeight: skinType.skinTypeId === skinTypeId ? 'bold' : 'normal', // 🔥 Đậm khi chọn
                                            color: skinType.skinTypeId === skinTypeId ? '#D8959A' : '#000', // 🔥 Đổi màu chữ khi chọn
                                        }}>
                                        {skinType.skinTypeCodes}
                                    </p>
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
                    <div style={{ marginTop: '30px', textAlign: 'center', marginBottom: '30px' }}>
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
