import React from 'react';
import { Typography, Row, Col, Divider, Image } from 'antd';
import aboutUs1 from '../../assets/aboutUs1.png';
import aboutUs2 from '../../assets/aboutUs2.png';
import aboutUs3 from '../../assets/aboutUs3.png';
import aboutUs4 from '../../assets/aboutUs4.png';
import aboutUs5 from '../../assets/aboutUs5.png';

const { Title, Text } = Typography;

const AboutUs = () => {
    return (
        <>
            <Row justify="center" align="middle" style={{ marginTop: '50px', paddingLeft: '100px' }}>
                <Title style={{ color: '#C09090', fontSize: '48px', fontFamily: "'Prata', serif" }}>
                    Câu chuyện thương hiệu
                </Title>
            </Row>

            <Row justify="center" align="middle">
                <Col xs={24} sm={8} style={{ textAlign: 'center', justifyContent: 'center', paddingRight: '20px' }}>
                    <Text style={{ color: '#C09090', fontSize: '18px', fontWeight: 500, letterSpacing: '1px' }}>
                        MAVID
                        <br />
                        PREMIUM SKINCARE
                    </Text>
                </Col>
                <Col sm={1}>
                    <Divider type="vertical" style={{ height: '150px', borderColor: '#C09090', borderWidth: 2 }} />
                </Col>
                <Col xs={24} sm={12}>
                    <Text style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                        MAVID được thành lập với sứ mệnh mang đến những sản phẩm chăm sóc da chất lượng cao từ những
                        thành phần tự nhiên thuần khiết.
                        <br />
                        <br />
                        Chúng tôi tin rằng vẻ đẹp thực sự bắt nguồn từ làn da khỏe mạnh và sự tự tin. Mỗi sản phẩm đều
                        được nghiên cứu kỹ lưỡng và phát triển bởi đội ngũ chuyên gia với hơn 10 năm kinh nghiệm trong
                        ngành công nghiệp mỹ phẩm.
                    </Text>
                </Col>
            </Row>

            <Row justify="center" style={{ marginBottom: 60, marginTop: 60 }}>
                <Col xs={24} sm={22} md={20} lg={16}>
                    <Image
                        src="https://image.cocoonvietnam.com/uploads/Thumbnail_Avatar_0103_web_bi_500ml_a0816968b4.png"
                        preview={false}
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 12,
                            objectFit: 'cover',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        }}
                    />
                </Col>
            </Row>

            <Row justify="center" align="middle" gutter={[30, 30]} style={{ marginBottom: 100 }}>
                {/* Quote Section */}
                <Col
                    xs={24}
                    sm={22}
                    md={9}
                    style={{
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: 22,
                            fontStyle: 'italic',
                            color: '#C09090',
                            display: 'block',
                            marginBottom: 16,
                            lineHeight: '1.6',
                            fontWeight: 300,
                        }}>
                        "Chúng tôi không chỉ tạo ra mỹ phẩm, chúng tôi tạo ra trải nghiệm chăm sóc bản thân và nuôi
                        dưỡng làn da theo cách tự nhiên nhất."
                    </Text>
                    <Text
                        strong
                        style={{
                            fontSize: 16,
                            color: '#A3A3A3',
                            marginTop: 12,
                            letterSpacing: '1px',
                        }}>
                        - MAVID -
                    </Text>
                </Col>

                {/* Right Image Section */}
                <Col xs={24} sm={22} md={7}>
                    <Image
                        src="https://image.cocoonvietnam.com/uploads/81245781_579846235913417_8400551857373577216_n_bbdc0e28c8.jpg"
                        preview={false}
                        style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                            borderRadius: 12,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        }}
                    />
                </Col>
            </Row>

            <Row justify="center" align="middle" gutter={[30, 30]}>
                {/* Left Section: Images */}
                <Col xs={24} sm={12} md={10} lg={8}>
                    <Row gutter={[20, 20]} style={{ paddingLeft: '20px', minWidth: '200px', marginBottom: '80px' }}>
                        <Col span={12}>
                            <Image
                                src="https://image.cocoonvietnam.com/uploads/z3096547222807_536764ea18f31c0dfe4a73709d2b592b_1_92185e3983.jpg"
                                preview={false}
                                style={{
                                    width: '100%',
                                    objectFit: 'cover',
                                    borderRadius: 12,
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                                }}
                            />
                            <Image
                                src="https://image.cocoonvietnam.com/uploads/255851207_4488384907923767_5021908811223513261_n_d1d0829cfb.jpg"
                                preview={false}
                                style={{
                                    width: '100%',
                                    marginTop: 20,
                                    objectFit: 'cover',
                                    borderRadius: 12,
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                                }}
                            />
                        </Col>
                        <Col span={12}>
                            <Image
                                src="https://image.cocoonvietnam.com/uploads/3_cafe_tui_Moment_9f0f0f434d.jpg"
                                preview={false}
                                style={{
                                    width: '100%',
                                    objectFit: 'cover',
                                    marginTop: 100,
                                    marginLeft: 20,
                                    borderRadius: 12,
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                                }}
                            />
                        </Col>
                    </Row>
                </Col>

                {/* Right Section: Text */}
                <Col
                    xs={24}
                    sm={12}
                    md={12}
                    lg={10}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        minWidth: '200px',
                        marginLeft: '80px',
                        marginBottom: '80px',
                    }}>
                    <Row justify="center" align="middle">
                        <Title
                            style={{
                                color: '#C09090',
                                fontSize: '48px',
                                fontFamily: "'Prata', serif",
                            }}>
                            Đội ngũ của chúng tôi
                        </Title>
                    </Row>
                    <Text style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', textAlign: 'left' }}>
                        Đằng sau thương hiệu MAVID là đội ngũ chuyên gia đam mê và tài năng với sứ mệnh mang đến những
                        giải pháp chăm sóc da hiệu quả.
                        <br />
                        <br />
                        Mỗi thành viên đều có chuyên môn riêng từ nghiên cứu thành phần tự nhiên, phát triển công thức
                        độc quyền đến thiết kế trải nghiệm người dùng hoàn hảo. Chúng tôi cam kết không ngừng đổi mới để
                        mang đến những sản phẩm vượt trội.
                    </Text>

                    <Row justify="space-between" align="middle" style={{ marginTop: 60, width: '100%' }}>
                        <Col xs={8} style={{ textAlign: 'center', minWidth: '150px' }}>
                            <Title
                                style={{
                                    color: '#C09090',
                                    fontSize: '38px',
                                    letterSpacing: '2px',
                                    fontFamily: "'Prata', serif",
                                }}>
                                12
                            </Title>
                            <Text style={{ fontSize: '16px', letterSpacing: '1px', fontFamily: "'Prata', serif" }}>
                                Thành viên
                            </Text>
                        </Col>
                        <Col xs={8} style={{ textAlign: 'center', minWidth: '150px' }}>
                            <Title
                                style={{
                                    color: '#C09090',
                                    fontSize: '38px',
                                    letterSpacing: '2px',
                                    fontFamily: "'Prata', serif",
                                }}>
                                15
                            </Title>
                            <Text style={{ fontSize: '16px', letterSpacing: '1px', fontFamily: "'Prata', serif" }}>
                                Sản phẩm
                            </Text>
                        </Col>
                        <Col xs={8} style={{ textAlign: 'center', minWidth: '150px' }}>
                            <Title
                                style={{
                                    color: '#C09090',
                                    fontSize: '38px',
                                    letterSpacing: '2px',
                                    fontFamily: "'Prata', serif",
                                }}>
                                2023
                            </Title>
                            <Text style={{ fontSize: '16px', letterSpacing: '1px', fontFamily: "'Prata', serif" }}>
                                Thành lập
                            </Text>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default AboutUs;
