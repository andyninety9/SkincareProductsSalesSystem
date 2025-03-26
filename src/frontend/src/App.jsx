import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import AboutPage from './page/aboutPage/AboutPage';
import Login from './page/login/Login';
import Register from './page/register/Register';
import ResetPassword from './page/resetPassword/ResetPassword';
import Contact from './page/contact/Contact';
import Service from './page/service/Service';
import Faq from './page/faq/Faq';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './page/homePage/HomePage';
import UserLayout from './layout/userLayout/UserLayout';
// import ProductPage from './page/productPage/ProductPage';
import ProductDetailPage from './page/productDetail/ProductDetailPage';
import ReviewPage from './page/reviewPage/ReviewPage';
import CartPage from './page/cartPage/CartPage';
import CheckOutPage from './page/checkOutPage/CheckOutPage';
import EventPage from './page/eventPage/EventPage';
import AboutUs from './page/aboutUsPage/AboutUs';
import ProfilePage from './page/profilePage/ProfilePage';
import QuizPage from './page/quizPage/QuizPage';
import StartQuizPage from './page/quizPage/StartQuizPage';
import ManageOrderPage from './page/manageOrder/ManageOrder';
import ManageCommentPage from './page/manageComment/ManageComment';
import ResultPage from './page/quizPage/ResultPage';
import MainLayout from './layout/mainLayout/mainLayout';
import { Toaster } from 'react-hot-toast';
import OrderProcess from './page/orderProcess/orderProcess';
import ProtectedRoute from './routes/ProtectedRoute';
import Page404 from './page/pageNotFound/page404';
import RestrictedPage from './page/restrictedPage/restrictedPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ManageAccount from './page/manageAccount/ManageAccount';
import ManageProduct from './page/manageProduct/ManageProduct';
import ManageEvent from './page/manageEvent/ManageEvent';
import ManageImgProduct from './page/manageProduct/ManageImgProduct';
import ManageQuiz from './page/manageQuiz/ManageQuiz';
import DemoUpload from './page/DemoUpload';
import ManageCategory from './page/manageCategory/ManageCategory';
import ManageSkintype from './page/manageSkintype/ManageSkintype';
import ManageBrand from './page/manageBrand/ManageBrand';
import ThankForOrderPage from './page/thankForOrderPage/ThankForOrderPage';
import ResultQuizHistoryPage from './page/resultQuizHistory/ResultQuizHistoryPage';
import OrderHistoryPage from './page/orderHistoryPage/OrderHistoryPage';
import VerifyEmailPage from './page/verifyEmailPage/VerifyEmailPage';
import DashboardPage from './page/dashboardPage/DashboardPage';

function App() {
    const router = createBrowserRouter([
        {
            path: routes.login,
            element: <Login />,
        },

        {
            path: routes.register,
            element: <Register />,
        },
        {
            path: routes.changePasswordByToken,
            element: <ResetPassword />,
        },
        {
            path: routes.manageOrder,
            element: <ManageOrderPage />,
        },
        {
            path: routes.manageOrder,
            element: (
                <ProtectedRoute roles={['admin']}>
                    <ManageOrderPage />
                </ProtectedRoute>
            ),
        },
        {
            path: routes.home,
            element: <UserLayout />,
            children: [
                { path: '/demoUpload', element: <DemoUpload /> },

                { path: routes.home, element: <HomePage /> },
                { path: routes.about, element: <AboutPage /> },
                { path: routes.product, element: <MainLayout /> },
                { path: routes.productDetail, element: <ProductDetailPage /> },
                { path: routes.review, element: <ReviewPage /> },
                { path: routes.contact, element: <Contact /> },
                { path: routes.service, element: <Service /> },
                { path: routes.promotion, element: <EventPage /> },
                { path: routes.faq, element: <Faq /> },
                { path: routes.cart, element: <CartPage /> },
                { path: routes.verifyEmail, element: <VerifyEmailPage /> },
                {
                    path: routes.checkout,
                    element: (
                        <ProtectedRoute roles={['Customer']}>
                            <CheckOutPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: routes.resultQuizHistory,
                    element: (
                        <ProtectedRoute roles={['Customer']}>
                            <ResultQuizHistoryPage />
                        </ProtectedRoute>
                    ),
                },
                { path: routes.event, element: <EventPage /> },
                { path: routes.aboutUs, element: <AboutUs /> },
                {
                    path: routes.profile,
                    element: (
                        <ProtectedRoute roles={['Customer', 'Manager', 'Staff']}>
                            <ProfilePage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: routes.paymentReturn,
                    element: (
                        <ProtectedRoute roles={['Customer']}>
                            <OrderProcess />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: routes.orderSuccess,
                    element: (
                        <ProtectedRoute roles={['Customer']}>
                            <ThankForOrderPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: routes.resultQuiz,
                    element: (
                        <ProtectedRoute roles={['Customer']}>
                            <ResultPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: routes.orderHistory,
                    element: (
                        <ProtectedRoute roles={['Customer']}>
                            <OrderHistoryPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: routes.notfound,
                    element: <Page404 />,
                },
                {
                    path: routes.restricted,
                    element: <RestrictedPage />,
                },
            ],
        },
        {
            path: routes.quiz,
            element: (
                <ProtectedRoute roles={['Customer']}>
                    <QuizPage />
                </ProtectedRoute>
            ),
        },
        {
            path: routes.startQuiz,
            element: (
                <ProtectedRoute roles={['Customer']}>
                    <StartQuizPage />
                </ProtectedRoute>
            ),
        },
        {
            path: routes.manageComment,
            element: (
                <ProtectedRoute roles={['Manager', 'Staff']}>
                    <ManageCommentPage />
                </ProtectedRoute>
            ),
        },
        {
            path: routes.manageAccount,
            element: (
                <ProtectedRoute roles={['Manager', 'Staff']}>
                    <ManageAccount />
                </ProtectedRoute>
            ),
        },
        {
            path: routes.dashboard,
            element: (
                <ProtectedRoute roles={['Manager']}>
                    <DashboardPage />
                </ProtectedRoute>
            ),
        },
        {
            path: routes.manageProduct,
            element: (
                <ProtectedRoute roles={['Manager', 'Staff']}>
                    <ManageProduct />
                </ProtectedRoute>
            ),
        },
        {
            path: routes.manageCategory,
            element: (
                <ProtectedRoute roles={['Manager', 'Staff']}>
                    <ManageCategory />
                </ProtectedRoute>
            ),
        },
        {
            path: routes.manageBrand,
            element: (
                <ProtectedRoute roles={['Manager', 'Staff']}>
                    <ManageBrand />
                </ProtectedRoute>
            ),
        },
        {
            path: routes.manageEvent,
            element: (
                <ProtectedRoute roles={['Manager', 'Staff']}>
                    <ManageEvent />
                </ProtectedRoute>
            ),
        },
        {
            path: routes.manageQuiz,
            element: (
                <ProtectedRoute roles={['Manager', 'Staff']}>
                    <ManageQuiz />
                </ProtectedRoute>
            ),
        },
        {
            path: routes.manageSkintype,
            element: (
                <ProtectedRoute roles={['Manager', 'Staff']}>
                    <ManageSkintype />
                </ProtectedRoute>
            ),
        },
    ]);

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <Toaster position="top-right" reverseOrder={false} />
            <RouterProvider router={router} />
        </GoogleOAuthProvider>
    );
}

export default App;
