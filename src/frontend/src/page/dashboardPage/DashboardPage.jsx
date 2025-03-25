import { useEffect, useState } from 'react';
import ManageOrderHeader from '../../component/manageOrderHeader/ManageOrderHeader';
import ManageOrderSidebar from '../../component/manageOrderSidebar/ManageOrderSidebar';
import api from '../../config/api';

export default function DashboardPage() {
    const [salesSummary, setSalesSummary] = useState(null);
    const [fromDate , setFromDate] = useState(null);
    const [toDate , setToDate] = useState(null);
    const handleFetchsalesSummary = async () => {
        try {
            const response = await api.get('report/sales-summary?fromDate=2025-01-01&toDate=2025-03-30');
            console.log(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleFetchsalesSummary();
    }, []);

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', flexDirection: 'column' }}>
            <ManageOrderHeader />
            <div style={{ display: 'flex', flex: 1, marginTop: '60px', overflow: 'hidden' }}>
                <ManageOrderSidebar />
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', marginLeft: '250px' }}>
                    <h1 style={{ fontSize: '40px', textAlign: 'left' }}>Dashboard</h1>
                </div>
            </div>
        </div>
    );
}
