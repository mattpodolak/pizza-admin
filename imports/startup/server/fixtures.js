// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Customers } from '../../api/customers.js';

Meteor.startup(() => {
  // if the Links collection is empty
  if (Customers.find().count() === 0) {
    const data = [
      { first_name: 'John', last_name: 'Smitherson', phone: '1234567890', address_one: '123 Fake St', address_two: '', postal_code: 'A1B2C3', city: 'Fakeland', createdAt: new Date() },
    ];
    data.forEach(customer => Customers.insert(customer));
  }
});
