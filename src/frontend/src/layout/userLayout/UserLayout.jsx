import React from 'react'

import { Outlet } from 'react-router-dom'
import HeaderUser from '../../component/header/headerUser'
import FooterUser from '../../component/footer/footerUser'

export default function UserLayout() {
    return (
        <>
            <HeaderUser/>
            <Outlet />
            <FooterUser/>
        </>
    )
}
