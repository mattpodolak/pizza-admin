import { Router } from 'meteor/iron:router'

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/customers/customers.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/login/login.js';
import '../../ui/pages/register/register.js';


Router.configure({

  noRoutesTemplate: 'App_notFound'
});

Router.route('/home', function () {
  // use the template named App_body for our layout
  this.layout('App_body');
  this.name('App.home')
  // {{> yield}}
  this.render('App_customers');
});

Router.route('/', function () {
  // use the template named App_body for our layout
  this.layout('App_body');
  this.name('App.home2')
  // {{> yield}}
  this.render('App_customers');
});

Router.route('/customers', function () {
  // use the template named App_body for our layout
  this.layout('App_body');
  this.name('App.customers')
  // {{> yield}}
  this.render('App_customers');
});

Router.route('/login', function () {
  // use the template named App_body for our layout
  this.layout('App_body');
  this.name('App.login')
  // {{> yield}}
  this.render('App_login');
});

Router.route('/register', function () {
  // use the template named App_body for our layout
  this.layout('App_body');
  this.name('App.register')
  // {{> yield}}
  this.render('App_register');
});

