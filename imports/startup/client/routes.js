// import { Router } from 'meteor/iron:router'
// import { Meteor } from 'meteor/meteor'
// import { CustomerCollection } from '../../api/customers.js'
// import { OrderCollection } from '../../api/customers.js'

// // Import needed templates
// import '../../ui/layouts/body/body.js';
// import '../../ui/pages/home/home.js';
// import '../../ui/pages/customers/customers.js';
// import '../../ui/pages/orders/orders.js';
// import '../../ui/pages/not-found/not-found.js';
// import '../../ui/pages/login/login.js';
// import '../../ui/pages/register/register.js';


// Router.configure({
//   noRoutesTemplate: 'App_notFound'
// });

// Router.route('/home', function () {
//   // use the template named App_body for our layout
//   this.layout('App_body');

//   // {{> yield}}
//   this.render('App_home');
// }, 
// {
//   name: 'App.home'
// });

// Router.route('/', function () {
//   // use the template named App_body for our layout
//   this.layout('App_body');

//   // {{> yield}}
//   this.render('App_home');
// },
// {
//   name: 'App.home2'
// });

// Router.route('/customers', function () {
//   // use the template named App_body for our layout
//   this.layout('App_body');
//   var username = Meteor.user().username
//   console.log(username)
//   var customers = CustomerCollection.find({user: username})
//   console.log(customers)
//   // {{> yield}}
//   this.render('App_customers', {
//     data: {
//       customerList: customers
//     }
//   });
// },
// {
//   name: 'App.customers'
// });

// Router.route('/orders', function () {
//   // use the template named App_body for our layout
//   this.layout('App_body');
//   var username = Meteor.user().username
//   console.log(username)
//   var orders = OrderCollection.find({user: username})
//   console.log(orders)
//   // {{> yield}}
//   this.render('App_orders', {
//     data: {
//       orderList: orders
//     }
//   });
// },
// {
//   name: 'App.orders'
// });

// Router.route('/login', function () {
//   // use the template named App_body for our layout
//   this.layout('App_body');

//   // {{> yield}}
//   this.render('App_login');
// },
// {
//   name: 'App.login'
// });

// Router.route('/register', function () {
//   // use the template named App_body for our layout
//   this.layout('App_body');

//   // {{> yield}}
//   this.render('App_register');

// },
// {
//   name: 'App.register'
// });

