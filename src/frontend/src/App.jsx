import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import UserLayout from './layout/userLayout/userLayout'
import HomePage from './page/homePage/homePage'
import AboutPage from './page/aboutPage/aboutPage'
import "./index.css";
import HeaderUser from './component/header/HeaderUser'
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  const router = createBrowserRouter([{
    path: routes.home,
    element: <UserLayout />,
    children: [{
      path: routes.home,
      element: <HomePage />
    },
    {
      path: routes.about,
      element: <AboutPage />
    },
    ]
  }])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
