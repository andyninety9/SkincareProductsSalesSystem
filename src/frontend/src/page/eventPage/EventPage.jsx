import React, { useEffect } from 'react';
import service1 from '../../assets/service1.jpeg';
import banner from '../../assets/bannerEvent.jpg';
import event from '../../assets/event.jpg';
import event1 from '../../assets/event1.png';
import event2 from '../../assets/event2.png';
import event3 from '../../assets/event3.png';
import event4 from '../../assets/event4.png';
import EventCarousel from '../../component/eventCarousel/EventCarousel';
import { Grid, Box, Typography } from '@mui/material';
import api from '../../config/api';
import { format } from 'date-fns';
import { Image } from 'antd';
import CardProduct from '../../component/cardProduct/card';
// import { Image } from 'primereact/image';


const EventPage = () => {
    const [listEvent, setListEvent] = React.useState([]);

    const handleFetchEvent = async () => {
        try {
            const response = await api.get('events?status=true');
            const processedItems = response.data.data.items.map((item) => ({
                ...item,
                eventId: item.eventId ? BigInt(item.eventId) : item.eventId,
            }));
            setListEvent(processedItems);
            console.log(listEvent);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleFetchEvent();
    }, []);

    return (
        <div className="container-fluid p-0">
            {/* Banner */}
            <div className="container-fluid p-0">
                {/* Banner */}
                <div
                    className="text-center mb-4 position-relative d-flex flex-column align-items-center justify-content-center"
                    style={{
                        background: `linear-gradient(rgba(181, 113, 112, 0.5), rgba(120, 120, 120, 0.5)), url(${banner}) no-repeat center center / cover`,
                        height: '300px',
                        width: '100vw',
                        maxWidth: '100%',
                        textAlign: 'center',
                    }}>
                    <h2 className="text-white fw-bold" style={{ fontSize: '70px', fontFamily: "'Prata', serif" }}>
                        Sự Kiện
                    </h2>
                    <h3
                        className="text-white fw-bold"
                        style={{ fontSize: '40px', fontFamily: "'Prata', serif", marginTop: '10px' }}>
                        Ra mắt Revision Skincare®
                    </h3>
                </div>
            </div>

            <div className="container text-center mt-5">
                <h1 className="" style={{ fontSize: '35px', fontFamily: "'Prata', serif", color: '#A76A6E' }}>
                    Sự kiện ra mắt Revision Skincare® tại thị trường Việt Nam
                </h1>
                {/* <img src={event1} alt="Event" className="img-fluid mt-3 mb-3" style={{ borderRadius: '10px', width:"700PX" }} /> */}

            <Image src={event} alt="Event" width="100" style={{ borderRadius: '10px' }} preview />
        
                <p className="text-muted">
                    - Revision Skincare -<br />
                    22/03/2024
                </p>
                <p className="text-start" style={{ fontSize: '18px' }}>
                    <span className="text-danger">Revision Skincare® </span>
                    trân trọng cảm ơn BS.CKI Phạm Nguyễn Khánh Ly đã đến tham dự và đồng hành cùng chúng tôi trong sự
                    kiện ra mắt Revision Skincare® tại thị trường Việt Nam vào ngày 20.03 vừa qua.
                </p>
                <p className="text-start" style={{ fontSize: '18px' }}>
                    Trong khuôn khổ sự kiện, BS.CKI Phạm Nguyễn Khánh Ly đã có bài chia sẻ hết sức thiết thực về công
                    nghệ trẻ hóa đa chiều DEJ Technology và kinh nghiệm ứng dụng sản phẩm của Revision Skincare® trong
                    các phác đồ điều trị tại Le’ Bali.
                </p>
                <Image
                    src={event2}
                    alt="Event Product"
                    // className="img-fluid mt-3 mb-3"
                    width="200"
                    style={{ borderRadius: '10px'}}
                    preview
                />
                <p className="text-muted">
                    - Revision Skincare -<br />
                    22/03/2024
                </p>
            </div>
            {listEvent.map((event, index) => (
               <div key={event.eventId || `event-${index}`} style={{ padding: '2rem' }}>
               <Typography
                   variant="h4"
                   fontFamily="'Prata', serif"
                   style={{ textAlign: 'left', marginBottom: '2rem', color: '#A76A6E', marginLeft: '2rem' }}>
                   {event.eventName}
               </Typography>
               <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                   {/* EventCarousel Component */}
                   <EventCarousel event={event} />
               </div>
           </div>
           
            ))}

            <div className="container text-center mt-5 mb-5">
                <p className="text-start" style={{ fontSize: '18px' }}>
                    <span className="text-danger">Revision Skincare® </span>
                    hy vọng sẽ tiếp tục được đồng hành cùng BS.CKI Phạm Nguyễn Khánh Ly trong những sự kiện tiếp theo
                    của Revision. Hãy cùng ngắm nhìn những khoảnh khắc đáng nhớ của BS.CKI Phạm Nguyễn Khánh Ly tại sự
                    kiện ra mắt Revision Skincare® nhé !
                </p>
            </div>

            {/* <Grid container sx={{ mt: 5 }}>

                <Grid item xs={12} md={6} container justifyContent="center">
                    <Box sx={{ width: 'fit-content', ml: 'auto', textAlign: 'left' }}>
                        <Typography variant="h5" fontFamily="'Prata', serif " sx={{ mb: 2, color: '#A76A6E' }}>
                            Liên Hệ
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 1 }}>
                            REVISION SKINCARE® | KHOA HỌC SÁNG TẠO – TRẺ HÓA ĐA CHIỀU
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Hotline: 0902 805 286
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Website:{' '}
                            <a href="https://biewgopcorn.com" target="_blank" rel="noopener noreferrer">
                                https://biewgopcorn.com
                            </a>
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Văn phòng Hồ Chí Minh: Số 3 đường 33, phường An Khánh, TP. Thủ Đức
                        </Typography>
                        <Typography variant="body2">
                            Văn phòng Hà Nội: Tầng 3, Tòa nhà Reeco, Số 98 Hoàng Ngân, Trung Hòa, Cầu Giấy
                        </Typography>
                    </Box>
                </Grid>


                <Grid item xs={12} md={5} container justifyContent="center">
                    <img
                        src={event4}
                        alt="Revision Skincare"
                        style={{
                            width: '60%',
                            height: 'auto',
                            borderRadius: '8px',
                        }}
                    />
                </Grid>
            </Grid> */}
        </div>
    );
};

export default EventPage;
