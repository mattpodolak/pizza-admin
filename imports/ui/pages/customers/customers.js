import { Template } from 'meteor/templating';
// import { Customers } from '../../api/customers';
// import { ReactiveDict } from 'meteor/reactive-dict';

import './customers.html';
import '../../components/customer.js';

// Template.App_customers.onCreated(function bodyOnCreated() {
//     this.state = new ReactiveDict();
//     //Meteor.subscribe('customers');
// });

Template.App_customers.helpers({
    // 'customerList': function(){
    //     return Customers.find({}, {sort: {first_name: 1}});
    // },
    customerList: [
        { first_name: 'John', last_name: 'Smitherson', phone: '1234567890', address_one: '123 Fake St', address_two: '', postal_code: 'A1B2C3', city: 'Fakeland', createdAt: new Date() },
    ],
});