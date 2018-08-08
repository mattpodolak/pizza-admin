import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './orders.html';
import '../../components/order.js';
import '../../components/cartItem.js';

Template.App_orders.onCreated(function bodyOnCreated() {
     this.state = new ReactiveDict();
     Meteor.subscribe('orderCollection');
 });

Template.App_orders.helpers({

});