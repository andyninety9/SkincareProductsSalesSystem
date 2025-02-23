import React from 'react'

import { Outlet } from 'react-router-dom'
import HeaderUser from '../../component/header/HeaderUser'
import FooterUser from '../../component/footer/FooterUser'

export default function UserLayout() {
    return (
        <>
            <HeaderUser />
            <Outlet />
            <FooterUser />
        </>
    )
}
