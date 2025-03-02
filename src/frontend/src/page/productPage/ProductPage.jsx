import { useEffect, useState } from 'react';
import { Select } from 'antd';
import Button from '../../component/button/Button.jsx';
import CardProduct from '../../component/cardProduct/card.jsx';
import CustomPagination from '../../component/pagination/CustomPagination.jsx';
import api from '../../config/api.jsx';
import banner from '../../assets/banner.jpg';
import './ProductPage.scss';

const imageskin = [
    { name: 'Da thường', image: '/src/assets/da-thuong.jpg' },
    { name: 'Da khô', image: '/src/assets/da-kho.jpg' },
    { name: 'Da dầu', image: '/src/assets/da-dau.jpg' },
    { name: 'Da hỗn hợp', image: '/src/assets/da-hon-hop.jpg' },
    { name: 'Da nhạy cảm', image: '/src/assets/da-nhay-cam.jpg' },
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

    const fetchProduct = async () => {
        try {
            const response = await api.get('Products');
            console.log('API Response:', response.data.data.items);

            if (response.data && response.data.data.items && Array.isArray(response.data.data.items)) {
                setProducts(response.data.data.items);
                setFilteredProducts(response.data.data.items);

                const uniqueBrands = [...new Set(response.data.data.items.map(item => item.brandName))];
                const uniqueCategories = [...new Set(response.data.data.items.map(item => item.categoryName))];
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
            filtered = filtered.filter(product => product.brandName === brandFilter);
        }
        if (categoryFilter) {
            filtered = filtered.filter(product => product.categoryName === categoryFilter);
        }
        setFilteredProducts(filtered);
        setPage(1);
    };

    const displayedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="product-page" style={{ margin: '0', maxWidth: '100%' }}>
            <div className="banner" style={{ position: 'relative', textAlign: 'center' }}>
                <img src={banner} alt="Banner" style={{ width: '100%' }} />
                <h2 style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    color: 'white',
                    fontSize: '30px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>Sản phẩm</h2>
            </div>
<div style={{display: 'flex', alignItems:"center", justifyContent:"space-between", margin:"1% 5%"}}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                {imageskin.map((imgs, index) => (
                    <div key={index} style={{ textAlign: 'center' }}>
                        <img src={imgs.image} alt={imgs.name} style={{ width: '100px', height: '120px' }} />
                        {/* <p>{imgs.name}</p> */}
                    </div>
                ))}
            </div>

            <div className="filters" style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Select 
                    style={{ width: '200px' }}
                    placeholder="Chọn thương hiệu"
                    options={brands.map(brand => ({ label: brand, value: brand }))}
                    onChange={value => setBrandFilter(value)}
                    allowClear
                />
                <Select 
                    style={{ width: '200px' }}
                    placeholder="Chọn danh mục"
                    options={categories.map(category => ({ label: category, value: category }))}
                    onChange={value => setCategoryFilter(value)}
                    allowClear
                />
                <Button text="Lọc" onClick={handleFilter} style={{ backgroundColor: '#D8959A', color: 'white', padding: '8px 16px' }} />
            </div>
            </div>

            {/* <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', justifyContent: 'center' }}>
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
            </div> */}

{displayedProducts.length === 0 ? (
    <div style={{height:"200px", display:"flex", alignItems:"center", justifyContent:"center"}}>
                <p style={{ textAlign: 'center', fontSize: '18px', color: '#D8959A', fontWeight: 'bold' }}>
                    Không tìm thấy sản phẩm phù hợp.
                </p>
                </div>
            ) : (
                <>
                    <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', justifyContent: 'center' }}>
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
