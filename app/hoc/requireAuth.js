import React from 'react';
import { Redirect } from 'react-router-dom';

export default function requireAuth(WrappedComponent) {
  return (props) => {
    if (!props.isLoggedIn) {
      return <Redirect to="/login" />;
    }

    return <WrappedComponent {...props} />;
  };
}

