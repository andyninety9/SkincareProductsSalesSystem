import React, { useEffect, useState } from 'react';
import { Button, Rate } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

const reviews = [
    {
        title: 'Best cream ever',
        date: '15/01/2025',
        rating: 5,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBmZb7Pxj3VQtYcPZIiSBgD0oJ33YWWiwabg&s',
        content:
            "The way this cream feels on my it's pure heaven. It hydrates so good and it lasts for hours. I usually wear it during the day but last night was the first time I used it as a night moisturizer. I twist and turn during sleep and when I woke, I was still fully moisturized.",
    },
    {
        title: 'Great product',
        date: '10/01/2025',
        rating: 4,
        image: 'https://storage.beautyfulls.com/uploads-1/sg-press/600x/innisfree-green-tea-balancing-cream-ex-152085.webp',
        content:
            "Perfect!!! The way this cream feels on my it's pure heaven. It hydrates so good and it lasts for hours. I usually wear it during the day but last night was the first time I used it as a night moisturizer. I twist and turn during sleep and when I woke, I was still fully moisturized.",
    },
    {
        title: 'Amazing texture and results',
        date: '02/01/2025',
        rating: 5,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgXkHOvv8269JsJC8UT-Xlc78n8PVLV4oPRg&s',
        content:
            'I’ve been using this cream for two weeks now, and the texture is so smooth. It absorbs quickly without feeling greasy and keeps my skin hydrated throughout the day. Highly recommend for anyone with dry skin.',
    },
    {
        title: 'A bit too thick',
        date: '05/01/2025',
        rating: 3,
        image: 'https://selena.vn/wp-content/uploads/2024/06/Tinh-chat-phuc-hoi-da-ban-dem-Serum-Estee-Lauder-Advanced-Night-Repair.webp',
        content:
            "I like the product but it’s a little too thick for my skin type. I have combination skin, and this cream doesn't absorb as easily in some areas, making it feel a bit sticky. Still, it does a good job moisturizing.",
    },
    {
        title: 'Nice fragrance, works well',
        date: '20/12/2024',
        rating: 4,
        image: 'https://product.hstatic.net/1000296801/product/z5497010388616_3dbde9a3fbee2ad6102c12a23772df93_71abf3ad52034810b3b230b2375ed1b9_grande.jpg',
        content:
            'The fragrance of this cream is amazing, and it works well on my skin. It leaves my face feeling soft and smooth. I just wish it wasn’t so heavily scented, but otherwise, I’m very happy with the product.',
    },
    {
        title: 'Best cream ever',
        date: '15/01/2025',
        rating: 5,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBmZb7Pxj3VQtYcPZIiSBgD0oJ33YWWiwabg&s',
        content:
            "The way this cream feels on my it's pure heaven. It hydrates so good and it lasts for hours. I usually wear it during the day but last night was the first time I used it as a night moisturizer. I twist and turn during sleep and when I woke, I was still fully moisturized.",
    },
    {
        title: 'Great product',
        date: '10/01/2025',
        rating: 4,
        image: 'https://storage.beautyfulls.com/uploads-1/sg-press/600x/innisfree-green-tea-balancing-cream-ex-152085.webp',
        content:
            "Perfect!!! The way this cream feels on my it's pure heaven. It hydrates so good and it lasts for hours. I usually wear it during the day but last night was the first time I used it as a night moisturizer. I twist and turn during sleep and when I woke, I was still fully moisturized.",
    },
    {
        title: 'Amazing texture and results',
        date: '02/01/2025',
        rating: 5,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgXkHOvv8269JsJC8UT-Xlc78n8PVLV4oPRg&s',
        content:
            'I’ve been using this cream for two weeks now, and the texture is so smooth. It absorbs quickly without feeling greasy and keeps my skin hydrated throughout the day. Highly recommend for anyone with dry skin.',
    },
    {
        title: 'A bit too thick',
        date: '05/01/2025',
        rating: 3,
        image: 'https://selena.vn/wp-content/uploads/2024/06/Tinh-chat-phuc-hoi-da-ban-dem-Serum-Estee-Lauder-Advanced-Night-Repair.webp',
        content:
            "I like the product but it’s a little too thick for my skin type. I have combination skin, and this cream doesn't absorb as easily in some areas, making it feel a bit sticky. Still, it does a good job moisturizing.",
    },
    {
        title: 'Nice fragrance, works well',
        date: '20/12/2024',
        rating: 4,
        image: 'https://product.hstatic.net/1000296801/product/z5497010388616_3dbde9a3fbee2ad6102c12a23772df93_71abf3ad52034810b3b230b2375ed1b9_grande.jpg',
        content:
            'The fragrance of this cream is amazing, and it works well on my skin. It leaves my face feeling soft and smooth. I just wish it wasn’t so heavily scented, but otherwise, I’m very happy with the product.',
    },
];

const calculateAverageRating = (reviews) => {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1); // Làm tròn đến 1 chữ số thập phân
};

export default function ReviewPage() {
    const averageRating = calculateAverageRating(reviews);

    const [visibleReviews, setVisibleReviews] = useState(4);

    const handleLoadMore = () => {
        const newVisibleReviews = visibleReviews + 4;
        setVisibleReviews(newVisibleReviews);
    };

    // Scroll to top khi click vào nút
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Hàm để hiện nút mũi tên khi cuộn xuống
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 200) {
            // Cài đặt khoảng cách cuộn để hiển thị nút
            setShowScrollToTop(true);
        } else {
            setShowScrollToTop(false);
        }
    };

    // Dùng useEffect để theo dõi sự kiện cuộn trang
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Dọn dẹp sự kiện khi component bị hủy
    }, []);

    return (
        <div>
            <div
                style={{
                    maxWidth: '1440px',
                    backgroundColor: '#F6EEF0',
                }}>
                <div
                    style={{
                        maxWidth: '1100px',
                        margin: 'auto',
                        padding: '20px 250px',
                    }}>
                    <div style={{ marginTop: '50px' }}>
                        <div style={{ marginBottom: '4%' }}>
                            <h2
                                style={{
                                    fontSize: '35px',
                                    fontWeight: 'bold',
                                    marginBottom: '20px',
                                    color: '#A76A6E',
                                    textAlign: 'center',
                                }}>
                                Đánh giá sản phẩm
                            </h2>
                            {/* Hiển thị đánh giá trung bình */}
                            <div style={{ fontSize: '16px', marginBottom: '20px', textAlign: 'center' }}>
                                <Rate value={parseFloat(averageRating)} disabled style={{ color: '#A76A6E' }} />
                                <span style={{ fontSize: '14px', color: '#A76A6E', marginLeft: '10px' }}>
                                    {averageRating} / 5
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button
                                    style={{
                                        backgroundColor: '#A76A6E',
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                    }}>
                                    Viết đánh giá
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {reviews.slice(0, visibleReviews).map((review, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        borderBottom: '1px solid #ddd',
                                        paddingBottom: '20px',
                                    }}>
                                    {/* Phần đánh giá và nội dung */}
                                    <div
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            marginRight: '20px',
                                            width: '40%',
                                        }}>
                                        {/* Hiển thị sao đánh giá */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Rate value={review.rating} disabled style={{ color: '#A76A6E' }} />
                                            <span style={{ fontSize: '14px', color: '#666' }}>({review.date})</span>
                                        </div>
                                        <span style={{ fontSize: '25px', color: '#A76A6E', marginTop: '10px' }}>
                                            {review.title}
                                        </span>
                                        {/* Hiển thị nội dung đánh giá */}
                                        <p
                                            style={{
                                                fontSize: '16px',
                                                color: '#333',
                                                lineHeight: '1.6',
                                                marginTop: '5px',
                                            }}>
                                            {review.content}
                                        </p>
                                    </div>

                                    {/* Phần hình ảnh */}
                                    <div style={{ flexShrink: 0 }}>
                                        <img
                                            src={review.image}
                                            alt="Review"
                                            style={{ width: '200px', height: 'auto', borderRadius: '5px' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {visibleReviews < reviews.length && (
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2%' }}>
                            <Button
                                onClick={handleLoadMore}
                                style={{
                                    backgroundColor: '#A76A6E',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '200px',
                                    height: '40px',
                                    fontSize: '15px',
                                }}>
                                Tải thêm
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div>
                {/* Nút mũi tên quay lại đầu trang */}
                {showScrollToTop && (
                    <div
                        onClick={scrollToTop}
                        style={{
                            position: 'fixed',
                            bottom: '30px',
                            right: '30px',
                            backgroundColor: '#A76A6E',
                            color: 'white',
                            padding: '15px',
                            borderRadius: '100%',
                            cursor: 'pointer',
                            fontSize: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                            height: '15px',
                            width: '15px',
                        }}>
                        <ArrowUpOutlined style={{ fontSize: '70%' }} />
                    </div>
                )}
            </div>
        </div>
    );
}
