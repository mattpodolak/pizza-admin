import { Router } from 'meteor/iron:router'
import { CustomerCollection } from '../../api/customers.js'

Router.route('/show/:_phone', function () {
    var params = this.params
    var req = this.request;
    var res = this.response;
    var phoneNum = params._phone
    var customers = CustomerCollection.find({phone: phoneNum})
    console.log('Customer ', customers)
    res.end('hello');
}, {where: 'server'});

Router.route('/add', function () {
    var req = this.request;
    var res = this.response;
    var first_name = 'John', last_name= 'Smitherson', phone= '1234567890', address_one= '123 Fake St', address_two= '', postal_code= 'A1B2C3', city= 'Fakeland', user='Napoli';
    Meteor.call('customerCollection.insert', first_name, last_name, phone, address_one, address_two, postal_code, city);
    res.end('hello from the server\n');
}, {where: 'server'});