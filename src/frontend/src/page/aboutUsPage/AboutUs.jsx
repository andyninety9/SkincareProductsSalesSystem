import React from "react";
import { Typography, Row, Col, Divider, Image } from "antd";
import aboutUs1 from "../../assets/aboutUs1.png";
import aboutUs2 from "../../assets/aboutUs2.png";
import aboutUs3 from "../../assets/aboutUs3.png";
import aboutUs4 from "../../assets/aboutUs4.png";
import aboutUs5 from "../../assets/aboutUs5.png";

const { Title, Text } = Typography;

const AboutUs = () => {
    return (
        <>
            <Row justify="center" align="middle" style={{ marginTop: "50px", paddingLeft: "100px" }}>
                <Title style={{ color: "#C09090", fontSize: "48px", fontFamily: "'Prata', serif" }}>
                    Về chúng tôi
                </Title>
            </Row>

            <Row justify="center" align="middle" >

                <Col xs={24} sm={8} style={{ textAlign: "center", justifyContent: "center", paddingRight: "20px" }}>
                    <Text style={{ color: "#C09090", fontSize: "16px", fontWeight: 500 }}>
                        About MAVID
                        <br />
                        OUR TEAM
                    </Text>
                </Col>
                <Col sm={1} >
                    <Divider type="vertical" style={{ height: "150px", borderColor: "#C09090", borderWidth: 2 }} />
                </Col>
                <Col xs={24} sm={12}>

                    <Text style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. L
                        <br /><br />
                        It has survived not only five centuries, but also the leap into electronic typesetting,
                        remaining essentially unchanged. It was popularised in the 1960s with the release...
                    </Text>
                </Col>
            </Row>

            <Row justify="center" style={{ marginBottom: 40, marginTop: 40 }}>
                <Col xs={24} sm={22} md={20} lg={16}>
                    <Image
                        src={aboutUs1}
                        preview={false}
                        style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: 8,
                            objectFit: "cover",
                        }}
                    />
                </Col>
            </Row>

            <Row
                justify="center"
                align="middle"
                gutter={[20, 20]}
                style={{ marginBottom: 80 }}
            >
                {/* Quote Section */}
                <Col
                    xs={24}
                    sm={22}
                    md={9}
                    style={{
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",

                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontStyle: "italic",
                            color: "#C09090",
                            display: "block",
                            marginBottom: 8,

                        }}
                    >
                        “Lorem Ipsum is simply dummy text of the printing and typesetting industry. ”
                    </Text>
                    <Text
                        strong
                        style={{
                            fontSize: 16, color: "#A3A3A3", marginTop: 8
                        }}
                    >
                        - MAVID -
                    </Text>
                </Col>

                {/* Right Image Section */}
                <Col xs={24} sm={22} md={7}>
                    <Image
                        src={aboutUs2}
                        preview={false}
                        style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "cover",
                        }}
                    />
                </Col>
            </Row>
            <>


                <Row justify="center" align="middle" gutter={[20, 20]}>
                    {/* Left Section: Images */}
                    <Col xs={24} sm={12} md={10} lg={8}>
                        <Row gutter={[20, 20]} style={{ paddingLeft: "20px", minWidth: "200px", marginBottom: "60px" }}>
                            <Col span={12}>
                                <Image src={aboutUs3} preview={false} style={{ width: "100%", objectFit: "cover", borderRadius: 8 }} />
                                <Image src={aboutUs5} preview={false} style={{ width: "100%", marginTop: 20, objectFit: "cover", borderRadius: 8 }} />
                            </Col>
                            <Col span={12}>
                                <Image src={aboutUs4} preview={false} style={{ width: "100%", objectFit: "cover", marginTop: 100, marginLeft: 20, borderRadius: 8 }} />
                            </Col>
                        </Row>
                    </Col>

                    {/* Right Section: Text */}
                    <Col xs={24} sm={12} md={12} lg={10} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: "200px", marginLeft: "80px", marginBottom: "60px" }}>
                        <Row justify="center" align="middle" >
                            <Title
                                style={{
                                    color: "#C09090",
                                    fontSize: "48px",
                                    fontFamily: "'Prata', serif",
                                }}
                            >
                                Thành Viên
                            </Title>
                        </Row>
                        <Text style={{ fontSize: "16px", lineHeight: "1.6", color: "#333", textAlign: "left" }}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            It has survived not only five centuries.
                        </Text>


                        <Row justify="space-between" align="middle" style={{ marginTop: 40 }}>
                            <Col xs={8} style={{ textAlign: "center", minWidth: "150px" }}>
                                <Title style={{ color: "#C09090", fontSize: "36px", letterSpacing: "2px", fontFamily: "'Prata', serif" }}>
                                    03
                                </Title>
                                <Text style={{ fontSize: "16px", letterSpacing: "1px", fontFamily: "'Prata', serif" }}>
                                    Team Member
                                </Text>
                            </Col>
                            <Col xs={8} style={{ textAlign: "center", minWidth: "150px" }}>
                                <Title style={{ color: "#C09090", fontSize: "36px", letterSpacing: "2px", fontFamily: "'Prata', serif" }}>
                                    03
                                </Title>
                                <Text style={{ fontSize: "16px", letterSpacing: "1px", fontFamily: "'Prata', serif" }}>
                                    Establish
                                </Text>
                            </Col>
                            <Col xs={8} style={{ textAlign: "center", minWidth: "150px" }}>
                                <Title style={{ color: "#C09090", fontSize: "36px", letterSpacing: "2px", fontFamily: "'Prata', serif" }}>
                                    2025
                                </Title>
                                <Text style={{ fontSize: "16px", letterSpacing: "1px", fontFamily: "'Prata', serif" }}>
                                    Since
                                </Text>
                            </Col>
                        </Row>
                    </Col>

                </Row>
            </>

        </>
    );
};

export default AboutUs;
