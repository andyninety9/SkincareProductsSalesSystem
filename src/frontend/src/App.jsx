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
            path: routes.resetPassword,
            element: <ResetPassword />,
        },
        {
            path: routes.manageOrder,
            element: <ManageOrderPage />,
        },
        {
            path: routes.manageComment,
            element: <ManageCommentPage />,
        },

        {
            path: routes.home,
            element: <UserLayout />,
            children: [
                { path: routes.home, element: <HomePage /> },
                { path: routes.about, element: <AboutPage /> },
                { path: routes.product, element: <MainLayout /> },
                { path: '/product/:id', element: <ProductDetailPage /> },
                { path: routes.review, element: <ReviewPage /> },
                { path: routes.contact, element: <Contact /> },
                { path: routes.service, element: <Service /> },
                { path: routes.faq, element: <Faq /> },
                { path: routes.cart, element: <CartPage /> },
                { path: routes.checkout, element: <CheckOutPage /> },
                { path: routes.event, element: <EventPage /> },
                { path: routes.aboutUs, element: <AboutUs /> },
                { path: routes.profile, element: <ProfilePage /> },
                // { path: routes.quiz, element: <QuizPage /> },
                // { path: routes.startQuiz, element: <StartQuizPage /> },
                { path: routes.resultQuiz, element: <ResultPage /> },
                { path: '/payment-return', element: <OrderProcess /> },
            ],
        },

        { path: routes.quiz, element: <QuizPage /> },
        { path: routes.startQuiz, element: <StartQuizPage /> },
    ]);

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <RouterProvider router={router} />
        </>
    );
}

export default App;
