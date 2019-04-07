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
        // set variables
        var userName = this.urlParams.user
        var statuscode = this.bodyParams.statusCode
        var requestBody = this.bodyParams
        console.log("status ", statuscode)
        console.log(requestBody)
        //check status code if 2xx turn any print: 12 jobs to print: 10 as they printed fine, otherwise set to print 11
        if(statuscode.charAt(0) == "2"){
          //attempted print job succeeded, no longer needs to be printed
          var order = OrderCollection.findOne({print: 12, user: userName}, { sort: { createdAt: 1 } })
          if(order != null){
            OrderCollection.update(order._id, {
              $set: 
              {
                print: 10
              },
            });
          }
        }
        else{
          //attempted print job failed, still needs to be printed
          var order = OrderCollection.findOne({print: 12, user: userName}, { sort: { createdAt: 1 } })
          if(order != null){
            OrderCollection.update(order._id, {
              $set: 
              {
                print: 11
              },
            });
          }
        }
        //check if any orders need to be printed still
        var order = OrderCollection.findOne({print: 11, user: userName}, { sort: { createdAt: 1 } })
        if(order == null){
          //no orders to print
          console.log("No orders to print")
          return {"jobReady": "false"}
        }
        else{
          //order to print
          //return {"jobReady": "true", "mediaTypes":  [ "image/png", "text/plain" ]}
          console.log("Orders to print")
          return {"jobReady": "true", "mediaTypes":  [ "text/plain" ]}
        }
      },
      get: function () {
        var userName = this.urlParams.user
        //see if order needs to be re-downloaded
        var order = OrderCollection.findOne({print: 12, user: userName}, { sort: { createdAt: 1 } })
        if(order == null){
          //if no orders to be redownloaded, print next order thats ready
          var order = OrderCollection.findOne({print: 11, user: userName}, { sort: { createdAt: 1 } })
          if(order == null){
            //error encountered
            console.log("Error encountered")
            return {"Status": "404"}
          }
          else{
            //print order
            //print 12 - not disregarded until confirm code gotten from POST
            OrderCollection.update(order._id, {
              $set: 
              {
                print: 12
              },
            });
            //return {"Status": "200", "X-Star-Cut": "full; feed=true",  "Message": "order"}
            console.log("Print next order thats ready")
            return {"jobReady": "true", "mediaTypes":  [ "text/plain" ], "display": [{"name": "<deviceName>", "message": "HELLLOO [nl] HELO?"}]}
            //return {"Status": "200",  "Message": "order"}
          }
        }
        else{
          //print order
          //print 12 - not disregarded until confirm code gotten from POST
          OrderCollection.update(order._id, {
            $set: 
            {
              print: 12
            },
          });
          console.log("Reprint order that didn't delete")
          //return {"Status": "200", "X-Star-Cut": "full; feed=true",  "Message": "order"}
          return {"Status": "200",  "Message": "order"}
        }
      },
      delete: function () {
        //incase cant handle print
        //turn any print: 12 jobs to print: 11 as they didnt print
        var userName = this.urlParams.user
        var query = this.queryParams;
        var statuscode = query.code
        console.log("code ", statuscode)
        //check status code if 2xx turn any print: 12 jobs to print: 10 as they printed fine, otherwise set to print 11
        if(statuscode.charAt(0) == "2"){
          //attempted print job succeeded, no longer needs to be printed
          var order = OrderCollection.findOne({print: 12, user: userName}, { sort: { createdAt: 1 } })
          if(order != null){
            OrderCollection.update(order._id, {
              $set: 
              {
                print: 10
              },
            });
          }
        }
        else{
          //print failed, because printer couldn't handle the data
          var order = OrderCollection.findOne({print: 12, user: userName}, { sort: { createdAt: 1 } })
          if(order != null){
            OrderCollection.update(order._id, {
              $set: 
              {
                print: 11
              },
            });
          }
        }
        console.log("Delete order")
        return {"Status": "200"}
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

    Api.addRoute('palace', {authRequired: false}, {
      post: function () {
        var cart = this.bodyParams.cart;
        var subtotal = this.bodyParams.subtotal;
        var final = this.bodyParams.final;
        var delivery = this.bodyParams.delivery;
        var ordernum = this.bodyParams.ordernum;
        var customer = this.bodyParams.customer;
        console.log("Cart: ", cart[1]);
        console.log("Subtotal: ", subtotal);
        console.log("Final: ", final);
        console.log("Delivery Type: ", delivery);
        console.log("Order Number: ", ordernum);
        console.log("Customer: ", customer);
        return {"status": "success"}
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

