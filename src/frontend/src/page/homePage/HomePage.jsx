import React, { useEffect, useRef, useState } from "react";
import CarouselAntd from "./../../component/carouselComponent/carousel";
import { Col, Container, Row } from "react-bootstrap";
import CardProduct from "../../component/cardProduct/card";
import "./HomePage.scss";
import "swiper/css";
import "swiper/css/navigation";
import { SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaInstagram,
} from "react-icons/fa";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import ObjectSlider from "../../component/objectSlider/slider";

export default function HomePage() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  const category = [
    {
      img: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/dau1_154087bbdc.jpg",
      title: "Da Dầu",
    },
    {
      img: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/dau1_154087bbdc.jpg",
      title: "Da mụn",
    },
    {
      img: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/dau1_154087bbdc.jpg",
      title: "Da khô",
    },
    {
      img: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/dau1_154087bbdc.jpg",
      title: "Da đậu đỏ",
    },
    {
      img: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/dau1_154087bbdc.jpg",
      title: "Da abc",
    },
  ];

  const product = [
    {
      img: "https://nicolerae.ca/wp-content/uploads/2020/12/ayla-skin-products-nicole-rae-4.jpg",
      name: "Sữa tắm",
      desc: "daasdaasd",
      price: "15",
    },
    {
      img: "https://nicolerae.ca/wp-content/uploads/2020/12/ayla-skin-products-nicole-rae-4.jpg",
      name: "Sữa rưa3r mặt",
      desc: "daasdaasd",
      price: "35",
    },
    {
      img: "https://nicolerae.ca/wp-content/uploads/2020/12/ayla-skin-products-nicole-rae-4.jpg",
      name: "Sữa dưỡng ẩm",
      desc: "daasdaasd",
      price: "25",
    },
    {
      img: "https://en.pimg.jp/083/562/913/1/83562913.jpg",
      name: "Dầu gội",
      desc: "daasdaasd",
      price: "15",
    },
    {
      img: "https://en.pimg.jp/083/562/913/1/83562913.jpg",
      name: "Sữa tắm",
      desc: "daasdaasd",
      price: "35",
    },
    {
      img: "https://en.pimg.jp/083/562/913/1/83562913.jpg",
      name: "Sữa abcxyz",
      desc: "daasdaasd",
      price: "35",
    },
  ];

  const blog = [
    {
      date: "13.01.2025",
      img: "https://images2.thanhnien.vn/zoom/700_438/Uploaded/hongkyqc/2022_12_27/image2-6529.jpeg",
      name: "Chương trình “Thu gom chai nhựa” năm 2025",
      desc: "Mavid mang lại 115 điểm thu hồi vỏ chai trực tiếp, được triển khai tại 115 tỉnh thành trên khắp việt nam",
    },
    {
      date: "13.01.2025",
      img: "https://image.cocoonvietnam.com/uploads/Banner_Website_Thu_hoi_vo_chai_2611x1560_7d96395d75.jpg",
      name: "Chương trình phá đảo SWP năm 2025",
      desc: "Mavid mang lại 115 điểm thu hồi vỏ chai trực tiếp, được triển khai tại 115 tỉnh thành trên khắp việt nam",
    },
    {
      date: "13.01.2025",
      img: "https://linhanhacademy.edu.vn/wp-content/uploads/2022/10/cac-buoc-cham-soc-da-linh-anh.jpg",
      name: "Chương trình Thủ khoa SWP năm 2025",
      desc: "Mavid mang lại 115 điểm thu hồi vỏ chai trực tiếp, được triển khai tại 115 tỉnh thành trên khắp việt nam",
    },
    {
      date: "13.01.2025",
      img: "https://media.comem.vn/uploads/December2023/routine-skincare-ban-dem-da-dau.webp",
      name: "Chương trình “Thu gom chai nhựa” năm 2025",
      desc: "Mavid mang lại 115 điểm thu hồi vỏ chai trực tiếp, được triển khai tại 115 tỉnh thành trên khắp việt nam",
    },
    {
      date: "13.01.2025",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5QNSxq-_670fL8jU93oa43V3-cDq45gNj5Q&s",
      name: "Chương trình “Thu gom chai nhựa” năm 2025",
      desc: "Mavid mang lại 115 điểm thu hồi vỏ chai trực tiếp, được triển khai tại 115 tỉnh thành trên khắp việt nam",
    },
  ];
  return (
    <>
      <CarouselAntd
        img1={
          "https://img.pikbest.com/ai/illus_our/20230413/5840bfbb6b1bbae3f9da3f4832e6543a.jpg!sw800"
        }
        img2={
          "https://cms.piklab.vn/resources/Tai%20nguyen%20Piklab/File%20design%20TMDT/piklab2399.jpg"
        }
        img3={"https://m.media-amazon.com/images/I/81EgZNyZOJL.jpg"}
        img4={
          "https://static.vecteezy.com/system/resources/previews/002/433/251/non_2x/clear-skincare-product-banner-ads-on-wooden-table-with-white-paper-leaves-decorations-free-vector.jpg"
        }
      />
      <Container>
        <div className="section">
          <h4 className="section-title" style={{ marginLeft: "5%" }}>
            Sản Phẩm Bán Chạy
          </h4>

          <ObjectSlider
            slidesPerView={4}
            spaceBetween={30}
            navigationClass="bestsellet-slider-nav"
          >
            {product.map((prod, index) => (
              <SwiperSlide key={index}>
                <CardProduct product={prod} />
              </SwiperSlide>
            ))}
          </ObjectSlider>
        </div>

        <div className="section">
          <h4
            className="section-title"
            style={{ marginLeft: "5%", marginBottom: "2%" }}
          >
            Danh mục sản phẩm
          </h4>
          <ObjectSlider
            height="400px"
            slidesPerView={3}
            spaceBetween={40}
            navigationClass="category-slider-nav"
          >
            {category.map((cate, index) => (
              <SwiperSlide key={index}>
                <div className="category-skin">
                  <img src={cate.img} alt="" />
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
            />
            <div className="problem-skin-content-left-text">
              <h5>Chăm sóc Da</h5>
              <button className="problem-skin-content-left-text-button">
                Xem ngay
              </button>
            </div>
          </div>

          <div className="problem-skin-content-right">
            {" "}
            <img
              src="https://standard-beauty.co.za/cdn/shop/collections/Low_Res_Group1.jpg?v=1718295062"
              alt=""
            />
            <div className="problem-skin-content-right-text">
              <h5>Điều trị Da</h5>
              <button className="problem-skin-content-right-text-button">
                Xem ngay
              </button>
            </div>
          </div>
        </div>

        <div className="collection">
          <img
            src="https://www.skinician.com/cdn/shop/files/preview_images/SKINICIAN-pink-one-gift-set-for-dry-skin.jpg?v=1695379318&width=1946"
            alt=""
          />

          <div className="main-div">
            <h5>Bộ Sưu Tập</h5>
            <p>
              Bộ sưu tập mới từ nhãn hàng abcxyz, với các sản phẩm abcxyz giúp
              hỗ trợ việc điều trị mụn, làm sáng da abcxyz
            </p>
            <button>Xem ngay</button>
          </div>

          <img
            src="https://www.skinician.com/cdn/shop/files/SKINICIAN-skincare-gift-set-for-dry-skin.jpg?v=1706115387&width=1445"
            alt=""
          />
        </div>

        <div className="sale-event">
          <img
            src="https://www.lizzieinlace.com/wp-content/uploads/2020/06/2-pink-beauty-products.jpg"
            alt=""
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
        />
        <div className="about-us-content">
          {" "}
          <h5>Về Chúng Tôi</h5>
          <button>Khám phá</button>
        </div>
      </Container>

      <Container style={{ marginTop: "5%" }}>
        <div className="section">
          <h4 className="section-title">Bài Viết Mới Nhất</h4>
          <div className="blog-div">
            {blog.slice(0, 3).map((blog, index) => (
              <div className="blog-div-items" key={index}>
                <img src={blog.img} alt="" />
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
            {" "}
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
