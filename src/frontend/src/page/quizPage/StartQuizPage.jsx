import React, { useState } from 'react';
import { Button, Input, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../config/api';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Router, useNavigate } from 'react-router-dom';
import { startQuiz } from '../../redux/feature/quizSlice';

const { Title, Paragraph } = Typography;

// eslint-disable-next-line react/prop-types
const StartQuizPage = ({ onExit }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleStartQuiz = async (values) => {
        try {
            setLoading(true); // Set loading state to true when API call starts
            const response = await api.get('/skintest/start', {
                params: {
                    quizname: values.quizName,
                    quizdesc: values.quizDesc,
                },
            });

            if (response.data.statusCode === 200) {
                dispatch(startQuiz(response.data.data));
                toast.success('Bắt đầu quá trình kiểm tra da');
                setTimeout(() => {
                    navigate('/quiz');
                }, 500);
            } else {
                toast.error('Không thể kiểm tra da lúc này, vui lòng thử lại sau');
            }
        } catch (error) {
            console.log(error);
            toast.error('Không thể kiểm tra da lúc này, vui lòng thử lại sau');
        } finally {
            setLoading(false); // Reset loading state when API call completes (success or error)
        }
    };

    const validationSchema = Yup.object({
        quizName: Yup.string()
            .min(3, 'Tên bài quiz phải có ít nhất 3 ký tự')
            .max(50, 'Tên bài quiz không được vượt quá 50 ký tự')
            .required('Tên bài quiz không được để trống'),
        quizDesc: Yup.string()
            .min(5, 'Mô tả phải có ít nhất 5 ký tự')
            .max(200, 'Mô tả không được vượt quá 200 ký tự')
            .required('Mô tả bài quiz không được để trống'),
    });
    const handleConfirmExit = () => {
        const confirmExit = window.confirm('Bạn có muốn thoát khỏi bài quiz và quay lại trang chủ không?');
        if (confirmExit) {
            navigate('/'); // Navigate back to homepage
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#F6EEF0',
                height: 'auto',
                position: 'relative',
            }}>
            {/* Exit Button */}
            <Button
                onClick={handleConfirmExit}
                shape="circle"
                icon={<LogoutOutlined style={{ fontSize: '24px', color: '#E57373' }} />}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            />
            <div
                style={{
                    maxWidth: '750px',
                    margin: '50px auto',
                    padding: 20,
                    textAlign: 'center',
                }}>
                <Title style={{ fontSize: '30px' }} level={3}>
                    Bạn thuộc Type Da Baumann nào trong số 16 loại da?
                </Title>
                <Paragraph style={{ fontSize: '15px' }}>
                    Bạn muốn có làn da đẹp rạng rỡ như ý muốn? Chỉ cần 3 phút thôi, bạn sẽ biết chính xác loại da của
                    mình và có ngay một kế hoạch chăm sóc da phù hợp.
                </Paragraph>
                <Paragraph style={{ fontSize: '15px' }}>
                    Bài kiểm tra loại da miễn phí của chúng tôi, được phát triển bởi các chuyên gia da liễu, giúp bạn
                    xác định chính xác loại da của mình. Dựa trên kết quả, bạn sẽ nhận được gợi ý về quy trình chăm sóc
                    da tối ưu, tương tự như những phương pháp được áp dụng trong phòng khám chuyên nghiệp. Giờ đây, bạn
                    có thể trải nghiệm bài kiểm tra này ngay tại nhà và tìm kiếm những sản phẩm phù hợp nhất với Tuýp Da
                    Baumann của bạn!
                </Paragraph>
                <Paragraph strong style={{ fontSize: '15px' }}>
                    Bạn đã sẵn sàng khám phá làn da của mình chưa?
                </Paragraph>
                <Formik
                    initialValues={{ quizName: '', quizDesc: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        setSubmitting(false);
                        handleStartQuiz(values);
                    }}>
                    {({ isSubmitting }) => (
                        <Form>
                            {/* Quiz Name */}
                            <div className="mb-3">
                                <label className="form-label" style={{ fontSize: '44px', color: '#C87E83' }}>
                                    Bắt đầu làm bài kiểm tra da
                                </label>
                                <Field
                                    name="quizName"
                                    type="text"
                                    className="form-control border-0 border-bottom rounded-0 custom-border-bottom"
                                    style={{ backgroundColor: '#F6EEF0' }}
                                    placeholder="Nhập tên bài quiz: (Ví dụ: Kiểm tra da của tôi)"
                                />
                                <div style={{ height: '44px', textAlign: 'left' }}>
                                    <ErrorMessage name="quizName" component="div" className="text-danger small mt-1 h-full" />
                                </div>
                            </div>

                            {/* Quiz Description */}
                            <div className="mb-3">
                                <label className="form-label" style={{ fontSize: '14px', color: '#C87E83' }}>
                                    Mô tả bài quiz
                                </label>
                                <Field
                                    name="quizDesc"
                                    as="textarea"
                                    className="form-control border-0 border-bottom rounded-0 custom-border-bottom"
                                    style={{ backgroundColor: '#F6EEF0' }}
                                    placeholder="Nhập mô tả bài quiz: (Ví dụ: Bài quiz giúp xác định loại da của bạn)"
                                />
                                <div style={{ height: '34px', textAlign: 'left' }}>
                                    <ErrorMessage name="quizDesc" component="div" className="text-danger small mt-1" />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                htmlType="submit"
                                type="primary"
                                size="large"
                                loading={loading || isSubmitting}
                                style={{ backgroundColor: '#D8959A', width: '50%', height: '50px' }}
                                disabled={isSubmitting}>
                                Xác định loại da ngay
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default StartQuizPage;
