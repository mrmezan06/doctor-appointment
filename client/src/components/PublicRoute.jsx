import React from 'react'
import { Navigate } from 'react-router-dom';

function PublicRoute(props) {
    if(localStorage.getItem('token')) {
        // For full protection you need to check if the token is expired / valid
        // But, for this example, we will just render the component
        return <Navigate to="/" />;
    }else {
        return props.children;
    }
}

export default PublicRoute;