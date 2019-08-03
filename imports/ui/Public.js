import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const Public = ({ loggingIn, authenticated, component, ...rest }) => (
  <Route {...rest} render={(props) => {
    if (loggingIn) return <div></div>;
    return !authenticated ?
    (React.createElement(component, { ...props, loggingIn, authenticated })) :
    (<Redirect to="/home" />);
  }} />
);

Public.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  component: PropTypes.func,
};

export default Public;