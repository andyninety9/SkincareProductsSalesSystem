export default function RestrictedPage() {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                fontSize: '30px',
                fontWeight: 'bold',
            }}>
            Bạn không có quyền truy cập trang này
        </div>
    );
}
