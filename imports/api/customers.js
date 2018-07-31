// Definition of the customers collection
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

export const CustomerCollection = new Mongo.Collection('customerCollection');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('customerCollection', function customerCollectionPublication() {
      return CustomerCollection.find();
    });
  }

Meteor.methods({
    'customerCollection.insert'(first_name, last_name, phone, address_one, address_two, postal_code, city, user) {
      check(first_name, String);
      check(last_name, String);
      check(phone, String);
      check(address_one, String);
      check(address_two, String);
      check(postal_code, String);
      check(city, String);
        console.log('HELLLO')
      CustomerCollection.insert({
        first_name,
        last_name,
        phone,
        address_one,
        address_two,
        postal_code,
        city,
        user,
        createdAt: new Date()
      });
    },
    // 'tasks.remove'(taskId) {
    //   check(taskId, String);
   
    //   Tasks.remove(taskId);
    // },
    // 'tasks.setChecked'(taskId, setChecked) {
    //   check(taskId, String);
    //   check(setChecked, Boolean);
   
    //   Tasks.update(taskId, { $set: { checked: setChecked } });
    // },
  });
