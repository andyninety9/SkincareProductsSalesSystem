import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes for type checking
import Cookies from 'js-cookie'; // Import js-cookie package
import { routes } from '.';
// import { selectUser } from "../Redux/features/counterSlice"; // Adjust the import path as necessary

const ProtectedRoute = ({ children, roles = [] }) => {
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;

    // Check if the user is not logged in or doesn't have a role
    if (!user || !user.role) {
        return <Navigate to={routes.login} />;
    }

    // Ensure roles is an array and check if the user's role is in the allowed roles array
    if (!Array.isArray(roles) || !roles.includes(user.role)) {
        return <Navigate to={routes.restricted} />;
    }

    // If user has the required role, render the children components
    return children;
};

// Define PropTypes for type checking
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
