import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import PropTypes from 'prop-types';

import SignIn from './SignIn.jsx'
//import Profile from './Profile2.js/index.js';
import Authenticated from './Authenticated.js';
import Public from './Public.js';
import Index from './Index.jsx';
import Home from './Home.jsx';
import Dashboard from './Dashboard.jsx';
import Profile from './Profile.jsx';
import Customers from './Customers.jsx';
import Orders from './Orders.jsx';

const hist = createBrowserHistory();

const App = appProps => (
    <Router history={hist}>
        <Switch>
        <Authenticated exact path="/dashboard" component={Dashboard} {...appProps}/>
        <Authenticated exact path="/profile" component={Profile} {...appProps}/>
        <Authenticated exact path="/customers" component={Customers} {...appProps}/>
        <Authenticated exact path="/orders" component={Orders} {...appProps}/>
        <Authenticated exact path="/home" component={Home} {...appProps}/>
        <Public exact path="/login" component={SignIn} {...appProps}/>
        <Route exact name="index" path="/" component={Index} />
        </Switch>
    </Router>
);
  
  export default createContainer(() => {
    const loggingIn = Meteor.loggingIn();
    const userId = Meteor.userId();
  
    return {
      loggingIn,
      authenticated: !loggingIn && !!userId,
    };
  }, App);