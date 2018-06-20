import React from 'react';
import { Redirect } from 'react-router-dom';

export default function requireUnAuth(WrappedComponent) {
  return (props) => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      return <Redirect to="/" />;
    }

    return <WrappedComponent {...props} />;
  };
}
