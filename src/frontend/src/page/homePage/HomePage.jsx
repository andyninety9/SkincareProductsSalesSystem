import React, { useEffect, useRef, useState } from 'react';
import CarouselAntd from './../../component/carouselComponent/carousel';
import { Col, Container, Row } from 'react-bootstrap';
import CardProduct from '../../component/cardProduct/card';
import './HomePage.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import { SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FaChevronCircleLeft, FaChevronCircleRight, FaInstagram } from 'react-icons/fa';
import { CiCircleChevLeft, CiCircleChevRight } from 'react-icons/ci';
import ObjectSlider from '../../component/objectSlider/slider';
import api from '../../config/api';

export default function HomePage() {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const swiperRef = useRef(null);
    const [popularProduct, setPopularProduct] = useState([]);
    const [category, setCategory] = useState([]);

    const handleFetchPopularProduct = async () => {
        try {
            const response = await api.get('/products/top-selling?page=1&pageSize=10');
            const processedItems = response.data.data.items.map((item) => ({
                ...item,
                productId: item.productId ? BigInt(item.productId) : item.productId,
            }));
            setPopularProduct(processedItems);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFetchCategory = async () => {
        try {
            const response = await api.get('products/categories');
            const processedItems = response.data.data.items.map((item) => ({
                ...item,
                categoryId: item.categoryId ? BigInt(item.categoryId) : item.categoryId,
                // Add image URL based on category name
                img: categoryImages[item.cateProdName] || 'https://placehold.co/600x400?text=No+Image',
                title: item.cateProdName, // Set title to match the category name
            }));
            setCategory(processedItems);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleFetchCategory();
        handleFetchPopularProduct();
        if (swiperRef.current) {
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
        }
    }, []);

    const categoryImages = {
        Cleansers:
            'https://image.cocoonvietnam.com/uploads/Website_448744049_486999170354190_4651515310287941209_240911_2f2521e90d.jpg',
        Moisturizers: 'https://image.cocoonvietnam.com/uploads/Artboard_1_24cdb0bca9.jpg',
        'Serums & Treatments': 'https://image.cocoonvietnam.com/uploads/Artboard_10_303004049f.jpg',
        Sunscreens:
            'https://image.cocoonvietnam.com/uploads/Website_448744049_486999170354190_4651515310287941209_240911_2f2521e90d.jpg',
        Toners: 'https://image.cocoonvietnam.com/uploads/Artboard_7_2d844256a8.jpg',
        Exfoliants: 'https://image.cocoonvietnam.com/uploads/Artboard_5_8c28ccf387.jpg',
        'Bath & Shower': 'https://image.cocoonvietnam.com/uploads/srm_3efa789217.png',
        'Body Lotion': 'https://image.cocoonvietnam.com/uploads/banner_green_living_ca9790eb2d.jpg',
    };

    const blog = [
        {
            date: '13.01.2025',
            img: 'https://images2.thanhnien.vn/zoom/700_438/Uploaded/hongkyqc/2022_12_27/image2-6529.jpeg',
            name: 'Chương trình “Thu gom chai nhựa” năm 2025',
            desc: 'Mavid mang lại 115 điểm thu hồi vỏ chai trực tiếp, được triển khai tại 115 tỉnh thành trên khắp việt nam',
        },
        {
            date: '13.01.2025',
            img: 'https://image.cocoonvietnam.com/uploads/Banner_Website_Thu_hoi_vo_chai_2611x1560_7d96395d75.jpg',
            name: 'Chương trình phá đảo SWP năm 2025',
            desc: 'Mavid mang lại 115 điểm thu hồi vỏ chai trực tiếp, được triển khai tại 115 tỉnh thành trên khắp việt nam',
        },
        {
            date: '13.01.2025',
            img: 'https://linhanhacademy.edu.vn/wp-content/uploads/2022/10/cac-buoc-cham-soc-da-linh-anh.jpg',
            name: 'Chương trình Thủ khoa SWP năm 2025',
            desc: 'Mavid mang lại 115 điểm thu hồi vỏ chai trực tiếp, được triển khai tại 115 tỉnh thành trên khắp việt nam',
        },
        {
            date: '13.01.2025',
            img: 'https://media.comem.vn/uploads/December2023/routine-skincare-ban-dem-da-dau.webp',
            name: 'Chương trình “Thu gom chai nhựa” năm 2025',
            desc: 'Mavid mang lại 115 điểm thu hồi vỏ chai trực tiếp, được triển khai tại 115 tỉnh thành trên khắp việt nam',
        },
        {
            date: '13.01.2025',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5QNSxq-_670fL8jU93oa43V3-cDq45gNj5Q&s',
            name: 'Chương trình “Thu gom chai nhựa” năm 2025',
            desc: 'Mavid mang lại 115 điểm thu hồi vỏ chai trực tiếp, được triển khai tại 115 tỉnh thành trên khắp việt nam',
        },
    ];
    return (
        <>
            <CarouselAntd
                img1={'https://image.cocoonvietnam.com/uploads/Website_PC_e85f2a4872.png'}
                img2={'https://image.cocoonvietnam.com/uploads/Thumb_Cpas_AWO_Skin_T_03_2025_WEB_12_97a31d4c37.png'}
                img3={'https://image.cocoonvietnam.com/uploads/Thumb_Cpas_AWO_Skin_T_03_2025_WEB_13_b0518e1cae.png'}
                img4={'https://image.cocoonvietnam.com/uploads/Banner_Website_Thu_hoi_vo_chai_PC_eb79fb0ad1.jpg'}
            />
            <Container>
                <div className="section">
                    <h4 className="section-title" style={{ marginLeft: '5%' }}>
                        Sản Phẩm Bán Chạy
                    </h4>

                    <ObjectSlider slidesPerView={4} spaceBetween={30} navigationClass="bestsellet-slider-nav">
                        {popularProduct.map((prod, index) => (
                            <SwiperSlide key={index}>
                                <CardProduct product={prod} isProductDetail={true} />
                            </SwiperSlide>
                        ))}
                    </ObjectSlider>
                </div>

                <div className="section">
                    <h4 className="section-title" style={{ marginLeft: '5%', marginBottom: '2%' }}>
                        Danh mục sản phẩm
                    </h4>
                    <ObjectSlider
                        height="400px"
                        slidesPerView={3}
                        spaceBetween={40}
                        navigationClass="category-slider-nav">
                        {category.map((cate, index) => (
                            <SwiperSlide key={index}>
                                <div className="category-skin">
                                    <img src={cate.img} alt={cate.title} style={{ objectFit: 'cover' }} />
                                    <h5 className="category-name">{cate.title}</h5>
                                </div>
                            </SwiperSlide>
                        ))}
                    </ObjectSlider>
                </div>

                <div className="problem-skin">
                    <div className="problem-skin-content-left">
                        <img
                            src="https://standard-beauty.co.za/cdn/shop/collections/Low_Res_Group1.jpg?v=1718295062"
                            alt=""
                            style={{ objectFit: 'cover' }}
                        />
                        <div className="problem-skin-content-left-text">
                            <h5>Chăm sóc Da</h5>
                            <button className="problem-skin-content-left-text-button">Xem ngay</button>
                        </div>
                    </div>

                    <div className="problem-skin-content-right">
                        {' '}
                        <img
                            src="https://standard-beauty.co.za/cdn/shop/collections/Low_Res_Group1.jpg?v=1718295062"
                            alt=""
                        />
                        <div className="problem-skin-content-right-text">
                            <h5>Điều trị Da</h5>
                            <button className="problem-skin-content-right-text-button">Xem ngay</button>
                        </div>
                    </div>
                </div>

                <div className="collection">
                    <img
                        src="https://www.skinician.com/cdn/shop/files/preview_images/SKINICIAN-pink-one-gift-set-for-dry-skin.jpg?v=1695379318&width=1946"
                        alt=""
                        style={{ objectFit: 'cover' }}
                    />

                    <div className="main-div">
                        <h5>Bộ Sưu Tập</h5>
                        <p>
                            Bộ sưu tập mới từ nhãn hàng abcxyz, với các sản phẩm abcxyz giúp hỗ trợ việc điều trị mụn,
                            làm sáng da abcxyz
                        </p>
                        <button>Xem ngay</button>
                    </div>

                    <img
                        src="https://www.skinician.com/cdn/shop/files/SKINICIAN-skincare-gift-set-for-dry-skin.jpg?v=1706115387&width=1445"
                        alt=""
                        style={{ objectFit: 'cover' }}
                    />
                </div>

                <div className="sale-event">
                    <img
                        src="https://www.lizzieinlace.com/wp-content/uploads/2020/06/2-pink-beauty-products.jpg"
                        alt=""
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="sale-event-content">
                        <h5>Chương trình khuyến mãi</h5>
                        <p>Xem những chương trình khuyến mãi giảm giá mới nhất</p>
                        <button>Xem ngay</button>
                    </div>
                </div>
            </Container>

            <Container fluid className="about-us">
                <img
                    src="https://static.vecteezy.com/system/resources/previews/009/352/953/non_2x/cosmetics-spa-or-skin-care-product-ads-with-bottle-banner-ad-for-beauty-products-pink-pearl-and-bubble-on-pink-background-glittering-light-effect-design-vector.jpg"
                    alt=""
                    style={{ objectFit: 'cover' }}
                />
                <div className="about-us-content">
                    {' '}
                    <h5>Về Chúng Tôi</h5>
                    <button>Khám phá</button>
                </div>
            </Container>

            <Container style={{ marginTop: '5%' }}>
                <div className="section">
                    <h4 className="section-title">Bài Viết Mới Nhất</h4>
                    <div className="blog-div">
                        {blog.slice(0, 3).map((blog, index) => (
                            <div className="blog-div-items" key={index}>
                                <img src={blog.img} alt="" style={{ objectFit: 'cover' }} />
                                <div className="blog-div-items-content">
                                    <h5>Mavid | {blog.date}</h5>
                                    <h5>{blog.name}</h5>
                                    <p>{blog.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="section">
                    <div className="title-ins-div section-title">
                        {' '}
                        <h4>@mavidvietnam</h4>
                        <button>
                            Theo dõi Instagram Mavid <FaInstagram />
                        </button>
                    </div>

                    <div className="instagram-div">
                        <img
                            src="https://cdn.vectorstock.com/i/500p/40/18/cosmetic-bottle-on-geometric-podium-mock-up-banner-vector-29534018.jpg"
                            alt=""
                            className="instagram-div-banner"
                        />
                        <div className="instagram-post">
                            <div className="instagram-post-row">
                                <img
                                    src="https://cdn.vectorstock.com/i/500p/40/18/cosmetic-bottle-on-geometric-podium-mock-up-banner-vector-29534018.jpg"
                                    alt=""
                                />
                                <img
                                    src="https://cdn.vectorstock.com/i/500p/40/18/cosmetic-bottle-on-geometric-podium-mock-up-banner-vector-29534018.jpg"
                                    alt=""
                                />
                                <img
                                    src="https://cdn.vectorstock.com/i/500p/40/18/cosmetic-bottle-on-geometric-podium-mock-up-banner-vector-29534018.jpg"
                                    alt=""
                                />
                            </div>
                            <div className="instagram-post-row">
                                <img
                                    src="https://cdn.vectorstock.com/i/500p/40/18/cosmetic-bottle-on-geometric-podium-mock-up-banner-vector-29534018.jpg"
                                    alt=""
                                />
                                <img
                                    src="https://cdn.vectorstock.com/i/500p/40/18/cosmetic-bottle-on-geometric-podium-mock-up-banner-vector-29534018.jpg"
                                    alt=""
                                />
                                <img
                                    src="https://cdn.vectorstock.com/i/500p/40/18/cosmetic-bottle-on-geometric-podium-mock-up-banner-vector-29534018.jpg"
                                    alt=""
                                />
                            </div>
                            <div className="instagram-post-row">
                                <img
                                    src="https://cdn.vectorstock.com/i/500p/40/18/cosmetic-bottle-on-geometric-podium-mock-up-banner-vector-29534018.jpg"
                                    alt=""
                                />
                                <img
                                    src="https://cdn.vectorstock.com/i/500p/40/18/cosmetic-bottle-on-geometric-podium-mock-up-banner-vector-29534018.jpg"
                                    alt=""
                                />
                                <img
                                    src="https://cdn.vectorstock.com/i/500p/40/18/cosmetic-bottle-on-geometric-podium-mock-up-banner-vector-29534018.jpg"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}
