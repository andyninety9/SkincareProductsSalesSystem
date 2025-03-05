import HeaderStaff from '../../component/header/HeaderStaff';
import SidebarStaff from '../../component/Sidebar/SidebarStaff';
import { Outlet } from 'react-router-dom';

export default function StaffLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header cố định trên */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
        <HeaderStaff />
      </div>

      {/* Bố cục chính: Sidebar bên trái và Nội dung bên phải */}
      <div style={{ display: 'flex', flex: 1, marginTop: '1px' /* Điều chỉnh theo chiều cao của Header */ }}>
        {/* Sidebar cố định bên trái */}
        <div
          style={{
            width: '250px',
            height: 'calc(100vh - 60px)', // Chiều cao trừ đi Header
            backgroundColor: '#f8f9fa',
            position: 'fixed',
            top: '60px',  // Ngay dưới Header
            left: 0,
            bottom: 0,
            overflowY: 'auto',
            padding: '10px',
          }}
        >
          <SidebarStaff />
        </div>

        {/* Nội dung bên phải */}
        <div
          style={{
            flex: 1,
            marginLeft: '250px', // Để tránh bị Sidebar che mất
            padding: '20px',
            overflow: 'auto',
            width: 'calc(100% - 250px)',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
