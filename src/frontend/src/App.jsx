import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import UserLayout from './layout/userLayout/userLayout';
import HomePage from './page/homePage/homePage';
import AboutPage from './page/aboutPage/aboutPage';
import Login from './page/login/Login';
import Register from './page/register/Register';
import ResetPassword from './page/resetPassword/ResetPassword';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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

      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
