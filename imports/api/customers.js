// Definition of the customers collection
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Restivus } from 'meteor/nimble:restivus'

export const CustomerCollection = new Mongo.Collection('customerCollection');
export const OrderCollection = new Mongo.Collection('orderCollection');

Meteor.methods({
  'orderCollection.insert'(phone, cart, orderNum, deliveryType, subtotal, tax, delivery, tip, user) {
    check(phone, String);
    check(user, String);
    console.log('inserted into order db')
    OrderCollection.insert({
      phone,
      cart,
      orderNum,
      deliveryType,
      subtotal,
      tax,
      delivery,
      tip,
      user,
      print: 1,
      createdAt: new Date()
    });
  },
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
    Meteor.publish('orderCollection', function orderCollectionPublication() {
      return OrderCollection.find();
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
        var order = OrderCollection.findOne({phone: phoneNum, user: userName}, { sort: { createdAt: -1 } })
        console.log(this.user.username)
        if(customer == null){
          return {"status": "error", "message": "Customer doesn't exist"}
        }
        if(order == null){
          return {"status": "success", "data": customer, "recent": "nothing"}
        }
        console.log(order.cart)
        return {"status": "success", "data": customer, "recent": order.cart}
      }
    });

    Api.addRoute('add', {authRequired: true}, {
      post: function () {
        var first_name = this.bodyParams.first_name, last_name= this.bodyParams.last_name, phone= this.bodyParams.phone, address_one= this.bodyParams.address_one, address_two= this.bodyParams.address_two, postal_code= this.bodyParams.postal_code, city= this.bodyParams.city, user=this.bodyParams.user;
        Meteor.call('customerCollection.insert', first_name, last_name, phone, address_one, address_two, postal_code, city, user);
        return {"status": "success"}
      }
    });

    Api.addRoute('print/:user', {authRequired: true}, {
      get: function () {
        var userName = this.urlParams.user
        var order = OrderCollection.findOne({print: 1, user: userName}, { sort: { createdAt: 1 } })
        if(order == null){
          return {"status": "success", "data": null, "message":"Nothing to print"}
        }
        else{
          OrderCollection.update(order._id, {
            $set: 
            {
              print: 0
            },
          });
          return {"status": "success", "data": order, "message":"Order to print"}
        }
      }
    });

    Api.addRoute('print/2/:user', {authRequired: false}, {
      post: function () {
        //check if job is available
        var userName = this.urlParams.user
        var order = OrderCollection.findOne({print: 1, user: userName}, { sort: { createdAt: 1 } })
        if(order == null){
          //no orders to print
          return {"status": "success", "data": null, "message":"Nothing to print"}
        }
        else{
          //order to print
          return {"status": "success", "data": order, "message":"Order to print"}
        }
      },
      get: function () {
        var userName = this.urlParams.user
        var order = OrderCollection.findOne({print: 1, user: userName}, { sort: { createdAt: 1 } })
        if(order == null){
          return {"status": "success", "data": null, "message":"Nothing to print"}
        }
        else{
          OrderCollection.update(order._id, {
            $set: 
            {
              print: 0
            },
          });
          return {"status": "success", "data": order, "message":"Order to print"}
        }
      }
    });

    Api.addRoute('receipt/:user', {authRequired: true}, {
      get: function () {
        var userName = this.urlParams.user
        var order = OrderCollection.findOne({print: 0, user: userName}, { sort: { createdAt: 1 } })
        if(order == null){
          return {"status": "success", "data": null, "message":"Nothing to print"}
        }
        else{
          OrderCollection.update(order._id, {
            $set: 
            {
              print: 2
            },
          });
          return {"status": "success", "data": order, "message":"Receipt to print"}
        }
      }
    });

    Api.addRoute('order', {authRequired: true}, {
      post: function () {
        var phone = this.bodyParams.phone, cart= this.bodyParams.cart, orderNum= this.bodyParams.orderNum, deliveryType= this.bodyParams.deliveryType, subtotal=this.bodyParams.subtotal, tax=this.bodyParams.tax, delivery=this.bodyParams.delivery, tip=this.bodyParams.tip, user =this.bodyParams.user;
        Meteor.call('orderCollection.insert', phone, cart, orderNum, deliveryType, subtotal, tax, delivery, tip, user);
        return {"status": "success"}
      }
    });
  }

