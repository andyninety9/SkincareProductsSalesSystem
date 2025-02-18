import React, { useState } from 'react';
import { Collapse } from 'antd';
import { DownOutlined } from "@ant-design/icons"; // Import arrow icon
import "./Faq.css";


const categories = [
    { id: "orders", label: "Đơn hàng" },
    { id: "payment", label: "Thanh toán" },
    { id: "account", label: "Tài khoản" },
    { id: "product", label: "Sản phẩm" },
    { id: "shipping", label: "Giao hàng" },
    { id: "contact", label: "Liên hệ" },
];

const faqs = [
    // Orders
    { id: 1, category: "orders", question: "Làm thế nào để đặt hàng?", answer: "Bạn có thể đặt hàng trên trang web của chúng tôi bằng cách thêm sản phẩm vào giỏ hàng và tiến hành thanh toán." },
    { id: 2, category: "orders", question: "Tôi có thể huỷ đơn sau khi đặt hàng không?", answer: "Bạn có thể thay đổi hoặc hủy đơn hàng trước khi đơn hàng được xử lý. Vui lòng liên hệ bộ phận hỗ trợ để được hỗ trợ nhanh nhất." },
    { id: 3, category: "orders", question: "Làm thế nào để kiểm tra tình trạng đơn hàng?", answer: "Bạn có thể kiểm tra trạng thái đơn hàng bằng cách đăng nhập vào tài khoản của bạn và truy cập mục 'Đơn hàng của tôi'." },
    { id: 4, category: "orders", question: "Tôi có thể thay đổi địa chỉ giao hàng sau khi đặt hàng không?", answer: "Bạn có thể thay đổi địa chỉ trước khi đơn hàng được xác nhận. Hãy liên hệ ngay với bộ phận hỗ trợ." },
    { id: 5, category: "orders", question: "Có cần đăng ký tài khoản để đặt hàng không?", answer: "Không bắt buộc, bạn có thể đặt hàng với tư cách khách, nhưng chúng tôi khuyến khích đăng ký để dễ dàng theo dõi đơn hàng." },

    // Payment
    { id: 6, category: "payment", question: "Những phương thức thanh toán nào được chấp nhận?", answer: "Chúng tôi hỗ trợ thanh toán qua COD, thẻ ATM, VISA/MasterCard, và Ví MoMo." },
    { id: 7, category: "payment", question: "Thanh toán có an toàn không?", answer: "Chúng tôi sử dụng mã hóa SSL để đảm bảo thanh toán an toàn cho khách hàng." },
    { id: 8, category: "payment", question: "Tôi có thể yêu cầu hoàn tiền không?", answer: "Có, nếu sản phẩm không đúng mô tả hoặc bị lỗi, bạn có thể yêu cầu hoàn tiền trong vòng 7 ngày." },
    { id: 9, category: "payment", question: "Tại sao thanh toán của tôi bị từ chối?", answer: "Có thể do thông tin thẻ không hợp lệ, hết hạn hoặc lỗi hệ thống ngân hàng. Hãy kiểm tra và thử lại." },
    { id: 10, category: "payment", question: "Có chương trình trả góp không?", answer: "Hiện tại chúng tôi chưa hỗ trợ trả góp. Tuy nhiên, bạn có thể thanh toán bằng thẻ tín dụng và hưởng ưu đãi từ ngân hàng." },

    // Account
    { id: 11, category: "account", question: "Tôi quên mật khẩu, làm thế nào để khôi phục?", answer: "Bạn có thể nhấp vào 'Quên mật khẩu' trên trang đăng nhập và làm theo hướng dẫn." },
    { id: 12, category: "account", question: "Làm thế nào để thay đổi thông tin tài khoản?", answer: "Bạn có thể thay đổi thông tin tài khoản của mình bằng cách vào phần 'Hồ sơ' sau khi đăng nhập." },
    { id: 13, category: "account", question: "Tôi có thể đăng ký tài khoản bằng Facebook hoặc Google không?", answer: "Có, chúng tôi hỗ trợ đăng nhập nhanh qua Facebook và Google." },
    { id: 14, category: "account", question: "Làm thế nào để xóa tài khoản?", answer: "Bạn có thể gửi yêu cầu xóa tài khoản qua email của chúng tôi." },
    { id: 15, category: "account", question: "Tài khoản của tôi bị khóa, tôi phải làm gì?", answer: "Vui lòng liên hệ bộ phận hỗ trợ để được hướng dẫn mở khóa tài khoản." },

    // Product
    { id: 16, category: "product", question: "Nếu tôi nhận được hàng bị lỗi hoặc không đúng sản phẩm?", answer: "Nếu bạn nhận được hàng bị lỗi hoặc không đúng sản phẩm, vui lòng liên hệ bộ phận hỗ trợ khách hàng để được giải quyết." },
    { id: 17, category: "product", question: "Tôi có thể đổi trả sản phẩm không?", answer: "Có, bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ khi nhận hàng. Sản phẩm phải còn nguyên vẹn và chưa qua sử dụng." },
    { id: 18, category: "product", question: "Sản phẩm có bảo hành không?", answer: "Một số sản phẩm có bảo hành, vui lòng kiểm tra thông tin trên trang chi tiết sản phẩm." },
    { id: 19, category: "product", question: "Làm thế nào để phân biệt sản phẩm chính hãng?", answer: "Tất cả sản phẩm của chúng tôi đều có tem bảo đảm chất lượng. Nếu có nghi ngờ, hãy liên hệ ngay với bộ phận hỗ trợ." },
    { id: 20, category: "product", question: "Tôi có thể xem đánh giá từ khách hàng khác không?", answer: "Có, bạn có thể xem đánh giá trên trang chi tiết sản phẩm." },

    // Shipping
    { id: 21, category: "shipping", question: "Thời gian giao hàng là bao lâu?", answer: "Thời gian giao hàng tùy thuộc vào địa điểm của bạn. Thông thường, đơn hàng sẽ được giao trong vòng 3-5 ngày làm việc." },
    { id: 22, category: "shipping", question: "Tôi có thể theo dõi đơn hàng của mình không?", answer: "Có, bạn có thể theo dõi đơn hàng bằng cách truy cập vào mục 'Đơn hàng của tôi'." },
    { id: 23, category: "shipping", question: "Chi phí vận chuyển như thế nào?", answer: "Miễn phí vận chuyển với đơn hàng từ 99.000 VND. Đơn hàng dưới 99.000 VND sẽ có phí vận chuyển 30.000 VND." },
    { id: 24, category: "shipping", question: "Có hỗ trợ giao hàng nhanh không?", answer: "Có, chúng tôi có dịch vụ giao hàng nhanh trong 24 giờ với phụ phí bổ sung." },
    { id: 25, category: "shipping", question: "Làm thế nào để đổi địa chỉ nhận hàng?", answer: "Bạn có thể thay đổi địa chỉ trong vòng 12 giờ sau khi đặt hàng bằng cách liên hệ bộ phận hỗ trợ." },

    // Contact
    { id: 26, category: "contact", question: "Làm thế nào để liên hệ với bộ phận chăm sóc khách hàng?", answer: "Bạn có thể liên hệ với chúng tôi qua email support@example.com hoặc hotline 1900-xxx-xxx." },
    { id: 27, category: "contact", question: "Thời gian hỗ trợ khách hàng là khi nào?", answer: "Bộ phận chăm sóc khách hàng hoạt động từ 8:00 - 22:00 hàng ngày." },
    { id: 28, category: "contact", question: "Tôi có thể gặp trực tiếp để được hỗ trợ không?", answer: "Hiện tại chúng tôi chỉ hỗ trợ online qua email và hotline." },
    { id: 29, category: "contact", question: "Làm thế nào để gửi phản hồi về sản phẩm?", answer: "Bạn có thể gửi phản hồi trên trang sản phẩm hoặc liên hệ bộ phận hỗ trợ." },
    { id: 30, category: "contact", question: "Có hỗ trợ qua Zalo hoặc Messenger không?", answer: "Có, bạn có thể liên hệ chúng tôi qua Zalo hoặc Facebook Messenger." },
];



export default function Faq() {
    const [selectedCategory, setSelectedCategory] = useState("orders");

    const filteredFaqs = faqs
        .filter((faq) => faq.category === selectedCategory)
        .map((faq) => ({
            key: faq.id.toString(),
            label: <span style={{ color: "#C87E83", fontWeight: "bold" }}>{faq.question}</span>,
            children: <p>{faq.answer}</p>,
        }));

    return (
        <div className="faq-container">
            <h2 className="faq-title" style={{fontSize: "50px", marginBottom:"80px"}}>FAQs</h2>
            <div className="faq-category-container">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`faq-category-btn ${selectedCategory === cat.id ? "active" : ""}`}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <Collapse 
                items={filteredFaqs}
                bordered={false}
                expandIcon={({ isActive }) => (
                    <DownOutlined
                        style={{
                            color: "#C87E83",
                            fontSize: "14px",
                            transition: "transform 0.2s",
                            transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                    />
                )}
                className="custom-collapse"
            />
        </div>
    );
}
