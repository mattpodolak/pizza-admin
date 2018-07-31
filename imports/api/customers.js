// Definition of the customers collection
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Restivus } from 'meteor/nimble:restivus'

export const CustomerCollection = new Mongo.Collection('customerCollection');

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
    var customer =  CustomerCollection.findOne({phone: phone, user: user})
    if(customer == null){
      console.log('inserted into db')
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
    }
    else{
      console.log('updating db')
      CustomerCollection.update(customer._id, {
        $set: 
        {
          first_name: first_name,
          last_name: last_name,
          phone: phone,
          address_one: address_one,
          postal_code: postal_code,
          city: city,
          user: user,
          createdAt: new Date()
        },
      });
    }
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


if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('customerCollection', function customerCollectionPublication() {
      return CustomerCollection.find();
    });
    // Global API configuration
    var Api = new Restivus({
      useDefaultAuth: true,
      prettyJson: true
    });

    Api.addRoute('check/:user/:phone', {authRequired: true}, {
      
      get: function () {
        var phoneNum = this.urlParams.phone
        var userName = this.urlParams.user
        var customer =  CustomerCollection.findOne({phone: phoneNum, user: userName})
        console.log(this.user.username)
        if(customer == null){
          return {"status": "error", "message": "Customer doesn't exist"}
        }
        return {"status": "success", "data": customer}
      }
    });

    Api.addRoute('add', {authRequired: true}, {
      post: function () {
        var first_name = this.bodyParams.first_name, last_name= this.bodyParams.last_name, phone= this.bodyParams.phone, address_one= this.bodyParams.address_one, address_two= this.bodyParams.address_two, postal_code= this.bodyParams.postal_code, city= this.bodyParams.city, user=this.bodyParams.user;
        Meteor.call('customerCollection.insert', first_name, last_name, phone, address_one, address_two, postal_code, city, user);
        return {"status": "success"}
      }
    });
  }

