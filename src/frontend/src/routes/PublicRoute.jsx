import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { routes } from '.';

const PublicRoute = ({ children }) => {
    const accessToken = Cookies.get('accessToken')?.replaceAll('"', '');
    const refreshToken = Cookies.get('refreshToken')?.replaceAll('"', '');

    // If user is already authenticated, redirect to home page
    if (accessToken && refreshToken) {
        return <Navigate to={routes.home} />;
    }

    // If user is not authenticated, allow access to the public route
    return children;
};

PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PublicRoute;
