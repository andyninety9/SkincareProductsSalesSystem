import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
// import UserLayout from './layout/userLayout/userLayout';
import AboutPage from './page/aboutPage/aboutPage';
import Login from './page/login/Login';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './page/homePage/HomePage';
import UserLayout from './layout/userLayout/UserLayout';
import ProductPage from './page/productPage/ProductPage';

function App() {
  const router = createBrowserRouter([
    {
      path: routes.login,
      element: <Login />,
    },
    
    {
      path: routes.home,
      element: <UserLayout />,
      children: [
        { path: routes.home, element: <HomePage /> },
        { path: routes.about, element: <AboutPage /> },
        {path: routes.product, element:<ProductPage/>}
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
