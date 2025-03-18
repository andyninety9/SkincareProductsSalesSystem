import { useEffect, useState } from 'react';
import api from '../../config/api';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmailPage() {
    const [verifyToken, setVerifyToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, failed
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleVerifyEmail = async (emailVerifyToken) => {
        try {
            const result = await api.get(`authen/verify-email/${emailVerifyToken}`);
            console.log('Verify email result:', result);

            if (result.status === 200) {
                console.log('Email verified successfully');
                setVerificationStatus('success');

                // Redirect to login page after a short delay
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setVerificationStatus('failed');
            }
        } catch (error) {
            console.error('Email verification failed:', error);

            // Check for token expiration error
            if (error.response?.data?.Detail?.includes('token is expired')) {
                setVerificationStatus('expired');
                setErrorMessage('Your verification link has expired. Please request a new verification email.');
            } else {
                setVerificationStatus('failed');
                setErrorMessage(error.response?.data?.Message || 'Email verification failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Extract verifyToken from URL query parameters
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('verifyToken');

        if (token) {
            setVerifyToken(token);
            console.log('Verification token:', token);
            // Call the handleVerifyEmail function with the extracted token
            handleVerifyEmail(token);
        } else {
            console.error('No verification token found in URL');
            setVerificationStatus('failed');
            setErrorMessage('No verification token found in the URL.');
            setLoading(false);
        }
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center">Email Verification</h1>

            {loading ? (
                <div className="text-center">
                    <p>Please wait while we verify your email address...</p>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="text-center mt-4">
                    {verificationStatus === 'success' && (
                        <div className="alert alert-success">
                            <p>Your email has been verified successfully!</p>
                            <p>Redirecting to login page...</p>
                        </div>
                    )}

                    {verificationStatus === 'expired' && (
                        <div className="alert alert-warning">
                            <h4>Verification Link Expired</h4>
                            <p>{errorMessage}</p>
                            {/* <button className="btn btn-primary mt-3" onClick={() => navigate('/request-verification')}>
                                Request New Verification Email
                            </button> */}
                        </div>
                    )}

                    {verificationStatus === 'failed' && (
                        <div className="alert alert-danger">
                            <h4>Verification Failed</h4>
                            <p>{errorMessage}</p>
                            <p>The verification link may be invalid.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
