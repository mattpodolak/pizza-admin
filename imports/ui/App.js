import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import PropTypes from 'prop-types';

import SignIn from './SignIn.jsx'
import Profile from './Profile.js';
import Authenticated from './Authenticated.js';
import Public from './Public.js';
import Index from './Index.jsx';
import Home from './Home.jsx';

const hist = createBrowserHistory();

const App = appProps => (
    <Router history={hist}>
        <Switch>
        {/* <Route 
            exact path="/order-confirm/:id" 
            component={OrderConfirm}
        />
        <Route exact path="/checkout" component={Checkout} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/menu" component={Menu} /> */}
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