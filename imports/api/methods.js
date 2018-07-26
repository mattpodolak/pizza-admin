// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { CustomerCollection } from './customers.js';

// Meteor.methods({
//   'customers.insert'(title, url) {
//     check(url, String);
//     check(title, String);

//     return Customers.insert({
//       url,
//       title,
//       createdAt: new Date(),
//     });
//   },
// });
