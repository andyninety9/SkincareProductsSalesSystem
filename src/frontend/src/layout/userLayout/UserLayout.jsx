import { Outlet } from 'react-router-dom';
import HeaderUser from '../../component/header/HeaderUser';
import FooterUser from '../../component/footer/FooterUser';

export default function UserLayout() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Đảm bảo chiều cao tối thiểu bằng chiều cao màn hình
      }}
    >
      <HeaderUser />
      <div style={{ flex: 1 }}>
        {/* Phần nội dung chính */}
        <Outlet />
      </div>
      <FooterUser />
    </div>
  );
}
