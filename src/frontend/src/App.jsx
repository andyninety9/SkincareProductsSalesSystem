import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";
// import UserLayout from './layout/userLayout/userLayout';
import AboutPage from "./page/aboutPage/aboutPage";
import Login from "./page/login/Login";
import Register from "./page/register/Register";
import ResetPassword from "./page/resetPassword/ResetPassword";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./page/homePage/HomePage";
import UserLayout from "./layout/userLayout/UserLayout";
import ProductPage from "./page/productPage/ProductPage";
import ProductDetailPage from "./page/productDetail/ProductDetailPage";
import ReviewPage from "./page/reviewPage/ReviewPage";
import CartPage from "./page/cartPage/CartPage";
import CheckOutPage from "./page/checkoutPage/CheckoutPage";
import QuizPage from "./page/quizPage/QuizPage";
import StartQuizPage from "./page/quizPage/StartQuizPage";

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
      path: routes.home,
      element: <UserLayout />,
      children: [
        { path: routes.home, element: <HomePage /> },
        { path: routes.about, element: <AboutPage /> },
        { path: routes.product, element: <ProductPage /> },
        { path: routes.productDetail, element: <ProductDetailPage /> },
        { path: routes.review, element: <ReviewPage /> },
        { path: routes.cart, element: <CartPage /> },
        { path: routes.checkout, element: <CheckOutPage /> },
        { path: routes.quiz, element: <QuizPage /> },
        { path: routes.startQuiz, element: <StartQuizPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
