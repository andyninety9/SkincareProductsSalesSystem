import React from 'react'

import { Outlet } from 'react-router-dom'
import HeaderUser from '../../layout/userLayout/HeaderUser'
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
