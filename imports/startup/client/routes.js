import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Router } from 'meteor/iron:router'

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/customers/customers.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/login/login.js';

//header and footer 
Router.configure({
  layoutTemplate: 'App_body',
  noRoutesTemplate: 'App_notFound'
});

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

Router.route('/customers', {
  name: 'App.customers',
  template: 'App_customers'
});

Router.route('/login', {
  name: 'App.login',
  template: 'App_login'
});


// FlowRouter.notFound = {
//   action() {
//     BlazeLayout.render('App_body', { main: 'App_notFound' });
//   },
// };

