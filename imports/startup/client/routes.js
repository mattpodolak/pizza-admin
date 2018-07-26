import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Router } from 'meteor/iron:router'

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/test/test.js';

//header and footer 
Router.configure({
  layoutTemplate: 'App_body'
});

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

Router.route('/test',{
  name: 'App.test',
  template: 'App_test'
});

// FlowRouter.notFound = {
//   action() {
//     BlazeLayout.render('App_body', { main: 'App_notFound' });
//   },
// };

