import { Template } from 'meteor/templating';

import './customers.html';
import '../../components/customer.js';

Template.body.helpers({
    customerList: [
      { first_name: 'John', last_name: 'Smitherson', phone: '1234567890', address_one: '123 Fake St', address_two: '', postal_code: 'A1B2C3', city: 'Fakeland' },
    ],
});