import { useEffect, useState } from 'react';
import SelectBox from '../../component/button/Button.jsx';
import Button from '../../component/button/Button.jsx';
import CardProduct from '../../component/cardProduct/card.jsx';
import CustomPagination from '../../component/pagination/CustomPagination.jsx';
import api from '../../config/api.jsx';

const categories = [
    { name: 'Da thường', image: '/src/assets/da-thuong.jpg' },
    { name: 'Da khô', image: '/src/assets/da-kho.jpg' },
    { name: 'Da dầu', image: '/src/assets/da-dau.jpg' },
    { name: 'Da hỗn hợp', image: '/src/assets/da-hon-hop.jpg' },
    { name: 'Da nhạy cảm', image: '/src/assets/da-nhay-cam.jpg' },
];

// Danh sách sản phẩm mẫu
// const products = Array.from({ length: 24 }, (_, index) => ({
//     id: index + 1,
//     img: 'https://product.hstatic.net/1000360941/product/toner-innisfree-hoa-anh-dao_3400df3de24543f3958a7e5b704ab8ac_master.jpg',
//     name: `Sản phẩm ${index + 1}`,
//     desc: 'Mô tả ngắn về sản phẩm',
//     price: (Math.random() * 50 + 10).toFixed(2),
// }));

export default function ProductPage() {
    const [page, setPage] = useState(1);
    const pageSize = 12;
    const [products, setProducts] = useState([]);
    const displayedProducts = products.slice((page - 1) * pageSize, page * pageSize);

    const fetchProduct = async () => {
        try {
            const response = await api.get('products');

            console.log('API Response:', response.data.data.items);

            if (response.data && response.data.data.items && Array.isArray(response.data.data.items)) {
                setProducts(response.data.data.items);
                console.log('Fetched products:', response.data.data.items);
            } else {
                console.error('❌ Invalid API response format:', response.data);
                setProducts([]);
            }
        } catch (error) {
            console.error('❌ Fetch product error:', error);
            setProducts([]);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [page]);
    return (
        <div className="product-page" style={{ margin: '0', maxWidth: '100%' }}>
            {/* Banner */}
            <div
                className="banner"
                style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '0',
                    margin: '0',
                }}>
                {/* Ảnh banner */}
                <img
                    src="https://image.cocoonvietnam.com/uploads/banner_green_living_ca9790eb2d.jpg"
                    alt="Banner"
                    className="banner-image"
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />

                <div
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
                </div>
            </div>

            {/* Categories and Filters */}
            <div
                className="categories-filters"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 20px',
                    maxWidth: '1200px',
                    margin: '20px auto',
                }}>
                {/* Categories */}
                <div className="categories" style={{ display: 'flex', gap: '20px' }}>
                    {categories.map((cat, index) => (
                        <div key={index} className="category-item" style={{ textAlign: 'center' }}>
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="category-icon"
                                style={{ width: '100px', height: '120px' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="filters" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <SelectBox style={{ width: '350px' }} content={'Phân loại theo:'} />
                    <Button text="Lọc" style={{ backgroundColor: '#D8959A', color: 'white', padding: '8px 16px' }} />
                </div>
            </div>

            {/* Products Grid */}
            <div
                className="product-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)', // 4 cột
                    gap: '20px',
                    marginTop: '30px',
                    maxWidth: 'calc(100% - 40px)', // Giới hạn chiều rộng, trừ đi padding 2 bên
                    width: '100%', // Đảm bảo không bị co hẹp
                    padding: '0 20px', // Padding hai bên
                    justifyContent: 'center', // Đảm bảo grid nằm giữa
                    alignItems: 'center', // Căn giữa theo chiều dọc (nếu cần)
                    marginLeft: 'auto',
                    marginRight: 'auto', // Giúp căn giữa chính xác
                }}>
                {displayedProducts.map((product) => (
                    <CardProduct key={product.id} product={product} />
                ))}
            </div>

            <div style={{ marginBottom: '5%' }}>
                <CustomPagination
                    style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}
                    currentPage={page}
                    totalItems={products.length}
                    pageSize={pageSize}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}
