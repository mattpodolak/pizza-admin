import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './customers.html';
import '../../components/customer.js';

Template.App_customers.onCreated(function bodyOnCreated() {
     this.state = new ReactiveDict();
     Meteor.subscribe('customerCollection');
 });

Template.App_customers.helpers({

});
