// Definition of the customers collection
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Restivus } from 'meteor/nimble:restivus';
import { HTTP } from 'meteor/http';

export const CustomerCollection = new Mongo.Collection('customerCollection');
export const OrderCollection = new Mongo.Collection('orderCollection');
export const StripeTokenCollection = new Mongo.Collection('stripeTokenCollection');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('customerCollection', function customerCollectionPublication() {
      return CustomerCollection.find();
    });
    Meteor.publish('orderCollection', function orderCollectionPublication() {
      return OrderCollection.find();
    });
    Meteor.publish('stripeTokenCollection', function stripeTokenCollectionPublication() {
      return StripeTokenCollection.find();
    });
  
  }

  Meteor.methods({
    'stripeTokenCollection.insert'(auth_code) {
      if(! this.isSimulation){
  
      //check if logged in
      if (! Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }
    
      const client_secret = Meteor.settings.stripe;
  
      //Make API request here
      try {
        const result = HTTP.call('POST', 'https://connect.stripe.com/oauth/token', {
          data: { 
            client_secret: client_secret,
            code: auth_code,
            grant_type: "authorization_code"
          }
        });

      const stripe_user_id = result.data.stripe_user_id;
      const user = Meteor.userId();

      StripeTokenCollection.insert({
        stripe_user_id,
        user,
        createdAt: new Date()
      });
      return true
      }
      catch(e){
        console.log(e)
        return false
      }
    }
    },
    'orderCollection.insert'(phone, cart, orderNum, deliveryType, paymentType, instructions, subtotal, tax, delivery, tip, user) {
      check(phone, String);
      check(user, String);
      if(user == "Napoli"){
        var printNum = 11;
      }
      else if(user == "Palace"){
        var printNum = 11;
      }
      else{
        var printNum = 111;
      }
      console.log('inserted into order db')
      OrderCollection.insert({
        phone,
        cart,
        orderNum,
        deliveryType,
        paymentType,
        instructions,
        subtotal,
        tax,
        delivery,
        tip,
        user,
        print: printNum,
        createdAt: new Date()
      });
    },
    'orderCollection.insert2'(phone, cart, orderNum, deliveryType, paymentType, instructions, subtotal, tax, delivery, tip, user, userId) {
      check(phone, String);
      check(user, String);
      if(user == "Napoli"){
        var printNum = 11;
      }
      else if(user == "Palace"){
        var printNum = 11;
      }
      else{
        var printNum = 111;
      }
      console.log('inserted into order db')
      OrderCollection.insert({
        phone,
        cart,
        orderNum,
        deliveryType,
        paymentType,
        instructions,
        subtotal,
        tax,
        delivery,
        tip,
        user,
        userId,
        print: printNum,
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
    'customerCollection.insert2'(first_name, last_name, phone, address_one, address_two, postal_code, city, user, userId) {
      check(first_name, String);
      check(last_name, String);
      check(phone, String);
      check(address_one, String);
      check(address_two, String);
      check(postal_code, String);
      check(city, String);
      console.log('HELLLO')
      var customer =  CustomerCollection.findOne({userId: userId, user: user})
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
          userId,
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
            address_two: address_two,
            postal_code: postal_code,
            city: city,
            user: user,
            userId: userId,
            createdAt: new Date()
          },
        });
      }
    },
  });

  if (Meteor.isServer) {
    // Global API configuration
    var Api = new Restivus({
      useDefaultAuth: true,
      prettyJson: true
    });

    Api.addRoute('check/:user/:phone', {authRequired: true}, {
      
      get: function () {
        var phoneNum = this.urlParams.phone
        var userName = this.user.username
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
        var first_name = this.bodyParams.first_name, last_name= this.bodyParams.last_name, phone= this.bodyParams.phone, address_one= this.bodyParams.address_one, address_two= this.bodyParams.address_two, postal_code= this.bodyParams.postal_code, city= this.bodyParams.city, user=this.bodyParams.user, userId =this.bodyParams.userId;
        var user = this.user.username;
        Meteor.call('customerCollection.insert2', first_name, last_name, phone, address_one, address_two, postal_code, city, user, userId);
        return {"status": "success"}
      }
    });

    Api.addRoute('pay', {authRequired: true}, {
      //send payment through Stripe to connected account
      post: function () {
        //get Stripe token from authenticated user
        var token =  StripeTokenCollection.findOne({user: this.userId})
        console.log(this.userId)
        if(token.stripe_user_id == null){
          return {"status": 400, "message": "Missing Stripe Token"}
        }
        //send payment request to Stripe
        const stripe_account_id = token.stripe_user_id;
        const stripe = require('stripe')(Meteor.settings.stripe);
        const fee = 200;

        try{
          //pull info from url
          const total = this.bodyParams.total;
          const source_token = this.bodyParams.source_token;
          
          Future = Npm.require('fibers/future');
          var myFuture = new Future();

          stripe.charges.create({
            amount: total,
            currency: "cad",
            source: source_token,
            application_fee_amount: fee,
          }, {
            stripe_account: stripe_account_id,
          })
          .then(function(charge) {
            // asynchronously called
            myFuture.return(charge);
          }).catch(function(error){
            myFuture.return(error);
          });

          const charge = myFuture.wait();

          if(charge.status == 'succeeded'){
            return {"status": "success", "charge": charge}
          }
          else{
            return {"status": 400, "message": "charge failed", "charge": charge}
          }
        }
        catch(e){
          return {"status": 400, "message": e}
        }
      }
    });

    Api.addRoute('print/:user', {authRequired: true}, {
      get: function () {
        var userName = this.user.username;
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
        if(userName == "Napoli"){
          userName = "Palace";
        }
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
        if(userName == "Napoli"){
          userName = "Palace";
        }
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
            var total = Number(order.delivery) + Number(order.tax) + Number(order.subtotal);
            order.deliver = Number(order.delivery).toFixed(2)
            total = total.toFixed(2);
            var customer =  CustomerCollection.findOne({phone: order.phone, user: userName})
            if(customer == null){
              console.log("COULDN'T FIND CUSTOMER")
              var printBody = "PIZZA PALACE \n\nOrder Num: " + order.orderNum + "\nPhone: " + order.phone +
               "\nDelivery Choice: " + order.deliveryType + "\n\nORDER: \n" + order.cart + "\n\nSubtotal: \t" + order.subtotal + 
               "\nDelivery: \t" + order.delivery + "\nTax: \t" + order.tax + "\nTOTAL: \t" + total;            }
            else{
              var printBody = "PIZZA PALACE \n\nOrder Num: " + order.orderNum + "\nPhone: " + order.phone +
               "\nCustomer: " + customer.first_name + " " + customer.last_name + "\nAddress 1: " + customer.address_one + 
               "\nAddress 2: " + customer.address_two + "\nPostal Code: " + customer.postal_code + "\nCity: " + customer.city + 
               "\nDelivery Choice: " + order.deliveryType + "\n\nORDER: \n" + order.cart + "\n\nSubtotal: \t" + order.subtotal + 
               "\nDelivery: \t" + order.delivery + "\nTax: \t" + order.tax + "\nTOTAL: \t" + total;
            }
            //return {"Status": "200", "X-Star-Cut": "full; feed=true",  "Message": "order"}
            console.log("Print next order thats ready")
            //return {"jobReady": "true", "mediaTypes":  [ "text/plain" ], "display": [{"name": "<deviceName>", "message": "HELLLOO [nl] HELO?"}]}
            return {
              'statusCode': 200,
              headers: {
                'Content-Type': 'text/plain',
                'Status': 200
              },
              body: printBody
            }
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
          var total = Number(order.delivery) + Number(order.tax) + Number(order.subtotal);
          order.deliver = Number(order.delivery).toFixed(2)
          total = total.toFixed(2);
          var customer =  CustomerCollection.findOne({phone: order.phone, user: userName})
          if(customer == null){
            console.log("COULDN'T FIND CUSTOMER")
            var printBody = "PIZZA PALACE \n\nOrder Num: " + order.orderNum + "\nPhone: " + order.phone +
             "\nDelivery Choice: " + order.deliveryType + "\n\nORDER: \n" + order.cart + "\n\nSubtotal: \t" + order.subtotal + 
             "\nDelivery: \t" + order.delivery + "\nTax: \t" + order.tax + "\nTOTAL: \t" + total;            }
          else{
            var printBody = "PIZZA PALACE \n\nOrder Num: " + order.orderNum + "\nPhone: " + order.phone +
             "\nCustomer: " + customer.first_name + " " + customer.last_name + "\nAddress 1: " + customer.address_one + 
             "\nAddress 2: " + customer.address_two + "\nPostal Code: " + customer.postal_code + "\nCity: " + customer.city + 
             "\nDelivery Choice: " + order.deliveryType + "\n\nORDER: \n" + order.cart + "\n\nSubtotal: \t" + order.subtotal + 
             "\nDelivery: \t" + order.delivery + "\nTax: \t" + order.tax + "\nTOTAL: \t" + total;
          }
          //return {"Status": "200", "X-Star-Cut": "full; feed=true",  "Message": "order"}
          console.log("Print next order thats ready")
          //return {"jobReady": "true", "mediaTypes":  [ "text/plain" ], "display": [{"name": "<deviceName>", "message": "HELLLOO [nl] HELO?"}]}
          return {
            'statusCode': 200,
            headers: {
              'Content-Type': 'text/plain',
              'Status': 200
            },
            body: printBody
          }
        }
      },
      delete: function () {
        //incase cant handle print
        //turn any print: 12 jobs to print: 11 as they didnt print
        var userName = this.urlParams.user
        if(userName == "Napoli"){
          userName = "Palace";
        }
        var query = this.queryParams;
        var statuscode = query.code
        console.log("code ", statuscode)
        console.log("delete  ", query)
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

    Api.addRoute('print/3/:user', {authRequired: false}, {
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
            var total = Number(order.delivery) + Number(order.tax) + Number(order.subtotal);
            order.deliver = Number(order.delivery).toFixed(2)
            total = total.toFixed(2);
            var customer =  CustomerCollection.findOne({phone: order.phone, user: userName})
            var cartString = '';

            for(var i=0; i<order.cart.length; i++){
              var orderInfo = order.cart[i]
              console.log('DIRECT', order.cart[i])
              console.log('INDIRECT', orderInfo)
              cartString = cartString + '\n\n' + String(orderInfo.itemName) + '\n Addon: ' + String(orderInfo.addonValue);
              if(orderInfo.pizzaTop1 != null){
                cartString = cartString + '\n Pizza 1 Toppings: '
                if(orderInfo.pizzaTop1.length == 0){
                  cartString = cartString  +  "No toppings"
                }
                else{
                  for(var k=0; k<orderInfo.pizzaTop1.length; k++){
                    cartString = cartString + orderInfo.pizzaTop1[k] + " "
                  }
                }
              }

              if(orderInfo.pizzaTop2 != null){
                cartString = cartString + '\n Pizza 2 Toppings: '
                if(orderInfo.pizzaTop2.length == 0){
                  cartString = cartString  +  "No toppings"
                }
                else{
                  for(var k=0; k<orderInfo.pizzaTop2.length; k++){
                    cartString = cartString + orderInfo.pizzaTop2[k] + " "
                  }
                }
              }

              if(orderInfo.pizzaTop3 != null){
                cartString = cartString + '\n Pizza 3 Toppings: '
                if(orderInfo.pizzaTop3.length == 0){
                  cartString = cartString  +  "No toppings"
                }
                else{
                  for(var k=0; k<orderInfo.pizzaTop3.length; k++){
                    cartString = cartString + orderInfo.pizzaTop3[k] + " "
                  }
                }
              }

              if(orderInfo.pizzaTop4 != null){
                cartString = cartString + '\n Pizza 4 Toppings: '
                if(orderInfo.pizzaTop4.length == 0){
                  cartString = cartString  +  "No toppings"
                }
                else{
                  for(var k=0; k<orderInfo.pizzaTop4.length; k++){
                    cartString = cartString + orderInfo.pizzaTop4[k] + " "
                  }
                }
              }    
              if(orderInfo.pop1 != null){
                cartString = cartString + "\n Pop: " + orderInfo.pop1;
                if(orderInfo.pop2 != null){
                  cartString = cartString + " " + orderInfo.pop2;
                }
                if(orderInfo.pop3 != null){
                  cartString = cartString + " " + orderInfo.pop3;
                }
                if(orderInfo.pop4 != null){
                  cartString = cartString + " " + orderInfo.pop4;
                }
                if(orderInfo.pop5 != null){
                  cartString = cartString + " " + orderInfo.pop5;
                }
                if(orderInfo.pop6 != null){
                  cartString = cartString + " " + orderInfo.pop6;
                }
              } 

              if(orderInfo.dip1 != null){
                cartString = cartString + "\n Dip: " + orderInfo.dip1;
                if(orderInfo.dip2 != null){
                  cartString = cartString + " " + orderInfo.dip2;
                }
                if(orderInfo.dip3 != null){
                  cartString = cartString + " " + orderInfo.dip3;
                }
                if(orderInfo.dip4 != null){
                  cartString = cartString + " " + orderInfo.dip4;
                }
                if(orderInfo.dip5 != null){
                  cartString = cartString + " " + orderInfo.dip5;
                }
                if(orderInfo.dip6 != null){
                  cartString = cartString + " " + orderInfo.dip6;
                }
              }

              if(orderInfo.wings != null){
                cartString = cartString + '\n Wings: ' + orderInfo.wings;
              }
              if(orderInfo.chips != null){
                cartString = cartString + '\n Chips: ' + orderInfo.chips;
              }
              if(orderInfo.pasta != null){
                cartString = cartString + '\n Pasta: ' + orderInfo.pasta;
              }
            }
            console.log('POSTCART', cartString)
            if(customer == null){
              console.log("COULDN'T FIND CUSTOMER")
              var printBody = "NAPOLI PIZZA \n\nOrder Num: " + order.orderNum + '\n' + new Date() +  "\nPhone: " + order.phone +
               "\nDelivery Choice: " + order.deliveryType  + "\nPayment Choice: " + order.paymentType + "\nDelivery Instructions: " + order.instructions +                
               "\n\nORDER:" + cartString + "\n\nSubtotal: \t" + order.subtotal + 
               "\nDelivery: \t" + order.delivery + "\nTax: \t" + order.tax + "\nTOTAL: \t" + total +'\n\n';            }
            else{
              var printBody = "NAPOLI PIZZA \n\nOrder Num: " + order.orderNum + '\n' + new Date() +  "\nPhone: " + order.phone +
               "\nCustomer: " + customer.first_name + " " + customer.last_name + "\nAddress 1: " + customer.address_one + 
               "\nAddress 2: " + customer.address_two + "\nPostal Code: " + customer.postal_code + "\nCity: " + customer.city + 
               "\nDelivery Choice: " + order.deliveryType + "\nPayment Choice: " + order.paymentType + "\nDelivery Instructions: " + order.instructions + 
               "\n\nORDER:" + cartString + "\n\nSubtotal: \t" + order.subtotal + 
               "\nDelivery: \t" + order.delivery + "\nTax: \t" + order.tax + "\nTOTAL: \t" + total +'\n\n';
            }
            //return {"Status": "200", "X-Star-Cut": "full; feed=true",  "Message": "order"}
            console.log("Print next order thats ready")
            //return {"jobReady": "true", "mediaTypes":  [ "text/plain" ], "display": [{"name": "<deviceName>", "message": "HELLLOO [nl] HELO?"}]}
            return {
              'statusCode': 200,
              headers: {
                'Content-Type': 'text/plain',
                'Status': 200
              },
              body: printBody
            }
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
          var total = Number(order.delivery) + Number(order.tax) + Number(order.subtotal);
          order.deliver = Number(order.delivery).toFixed(2)
          total = total.toFixed(2);
          var customer =  CustomerCollection.findOne({phone: order.phone, user: userName})
          var cartString = '';

          for(var i=0; i<order.cart.length; i++){
            console.log('DIRECT', order.cart[i])
            var orderInfo = order.cart[i]
            console.log('INDIRECT', orderInfo)
            cartString = cartString + '\n\n' + String(orderInfo.itemName) + '\n Addon: ' + String(orderInfo.addonValue);
            if(orderInfo.pizzaTop1 != null){
              cartString = cartString + '\n Pizza 1 Toppings: '
              if(orderInfo.pizzaTop1.length == 0){
                cartString = cartString  +  "No toppings"
              }
              else{
                for(var k=0; k<orderInfo.pizzaTop1.length; k++){
                  cartString = cartString + orderInfo.pizzaTop1[k] + " "
                }
              }
            }

            if(orderInfo.pizzaTop2 != null){
              cartString = cartString + '\n Pizza 2 Toppings: '
              if(orderInfo.pizzaTop2.length == 0){
                cartString = cartString  +  "No toppings"
              }
              else{
                for(var k=0; k<orderInfo.pizzaTop2.length; k++){
                  cartString = cartString + orderInfo.pizzaTop2[k] + " "
                }
              }
            }

            if(orderInfo.pizzaTop3 != null){
              cartString = cartString + '\n Pizza 3 Toppings: '
              if(orderInfo.pizzaTop3.length == 0){
                cartString = cartString  +  "No toppings"
              }
              else{
                for(var k=0; k<orderInfo.pizzaTop3.length; k++){
                  cartString = cartString + orderInfo.pizzaTop3[k] + " "
                }
              }
            }

            if(orderInfo.pizzaTop4 != null){
              cartString = cartString + '\n Pizza 4 Toppings: '
              if(orderInfo.pizzaTop4.length == 0){
                cartString = cartString  +  "No toppings"
              }
              else{
                for(var k=0; k<orderInfo.pizzaTop4.length; k++){
                  cartString = cartString + orderInfo.pizzaTop4[k] + " "
                }
              }
            }    
            if(orderInfo.pop1 != null){
              cartString = cartString + "\n Pop: " + orderInfo.pop1;
              if(orderInfo.pop2 != null){
                cartString = cartString + " " + orderInfo.pop2;
              }
              if(orderInfo.pop3 != null){
                cartString = cartString + " " + orderInfo.pop3;
              }
              if(orderInfo.pop4 != null){
                cartString = cartString + " " + orderInfo.pop4;
              }
              if(orderInfo.pop5 != null){
                cartString = cartString + " " + orderInfo.pop5;
              }
              if(orderInfo.pop6 != null){
                cartString = cartString + " " + orderInfo.pop6;
              }
            } 

            if(orderInfo.dip1 != null){
              cartString = cartString + "\n Dip: " + orderInfo.dip1;
              if(orderInfo.dip2 != null){
                cartString = cartString + " " + orderInfo.dip2;
              }
              if(orderInfo.dip3 != null){
                cartString = cartString + " " + orderInfo.dip3;
              }
              if(orderInfo.dip4 != null){
                cartString = cartString + " " + orderInfo.dip4;
              }
              if(orderInfo.dip5 != null){
                cartString = cartString + " " + orderInfo.dip5;
              }
              if(orderInfo.dip6 != null){
                cartString = cartString + " " + orderInfo.dip6;
              }
            }

            if(orderInfo.wings != null){
              cartString = cartString + '\n Wings: ' + orderInfo.wings;
            }
            if(orderInfo.chips != null){
              cartString = cartString + '\n Chips: ' + orderInfo.chips;
            }
            if(orderInfo.pasta != null){
              cartString = cartString + '\n Pasta: ' + orderInfo.pasta;
            }
          }
          console.log('POSTCART', cartString)
          if(customer == null){
            console.log("COULDN'T FIND CUSTOMER")
            var printBody = "NAPOLI PIZZA \n\nOrder Num: " + order.orderNum + '\n' + new Date() + "\nPhone: " + order.phone +
             "\nDelivery Choice: " + order.deliveryType  + "\nPayment Choice: " + order.paymentType + "\nDelivery Instructions: " + order.instructions +                
             "\n\nORDER:" + cartString + "\n\nSubtotal: \t" + order.subtotal + 
             "\nDelivery: \t" + order.delivery + "\nTax: \t" + order.tax + "\nTOTAL: \t" + total+'\n\n';            }
          else{
            var printBody = "NAPOLI \n\nOrder Num: " + order.orderNum + '\n' + new Date() + "\nPhone: " + order.phone +
             "\nCustomer: " + customer.first_name + " " + customer.last_name + "\nAddress 1: " + customer.address_one + 
             "\nAddress 2: " + customer.address_two + "\nPostal Code: " + customer.postal_code + "\nCity: " + customer.city + 
             "\nDelivery Choice: " + order.deliveryType + "\nPayment Choice: " + order.paymentType + "\nDelivery Instructions: " + order.instructions + 
             "\n\nORDER:" + cartString + "\n\nSubtotal: \t" + order.subtotal + 
             "\nDelivery: \t" + order.delivery + "\nTax: \t" + order.tax + "\nTOTAL: \t" + total +'\n\n';
          }
          //return {"Status": "200", "X-Star-Cut": "full; feed=true",  "Message": "order"}
          console.log("Print next order thats ready")
          //return {"jobReady": "true", "mediaTypes":  [ "text/plain" ], "display": [{"name": "<deviceName>", "message": "HELLLOO [nl] HELO?"}]}
          return {
            'statusCode': 200,
            headers: {
              'Content-Type': 'text/plain',
              'Status': 200
            },
            body: printBody
          }
        }
      },
      delete: function () {
        //incase cant handle print
        //turn any print: 12 jobs to print: 11 as they didnt print
        var userName = this.urlParams.user
        if(userName == "Napoli"){
          userName = "Palace";
        }
        var query = this.queryParams;
        var statuscode = query.code
        console.log("code ", statuscode)
        console.log("delete  ", query)
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
        var deliveryType = this.bodyParams.delivery;
        var orderNum = this.bodyParams.ordernum;
        var customer = this.bodyParams.customer;
        

        if(deliveryType == "Delivery"){
          var delivery = 5;
        }
        else{
          var delivery = 0;
        }
        var tip = 0;
        var user = "Palace";
        var i;
        var cartString = cart[1] + "\n\n";
        for(i=2; i < cart.length; i++){
          cartString = cartString + cart[i] + "\n\n";
        }
        cart = cartString;
        var first_name = customer[0];
        var last_name = customer[1];
        var phone = customer[3];
        var address_one = customer[4];
        var address_two = customer[5];
        var postal_code = customer[7];
        var city = customer[6];
        var paymentType = null;
        var instructions = null;

        phone = phone.replace('Phone: ','');
        first_name = first_name.replace('Name: ','');
        last_name = last_name.replace(' ','');
        address_one = address_one.replace('Address 1: ','');
        address_two = address_two.replace('Address 2: ','');
        postal_code = postal_code.replace('Postal Code: ','');
        city = city.replace('City: ','');
        var tax = Number(subtotal)*0.13;
        tax = tax.toFixed(2);

        console.log("Cart: ", cart);
        Meteor.call('orderCollection.insert', phone, cart, orderNum, deliveryType, paymentType, instructions, subtotal, tax, delivery, tip, user);
        Meteor.call('customerCollection.insert', first_name, last_name, phone, address_one, address_two, postal_code, city, user);
        return {"status": "success"}
      }
    });

    Api.addRoute('order', {authRequired: true}, {
      post: function () {
        var phone = this.bodyParams.phone, cart= this.bodyParams.cart, orderNum= this.bodyParams.orderNum, deliveryType= this.bodyParams.deliveryType, subtotal=this.bodyParams.subtotal, tax=this.bodyParams.tax, delivery=this.bodyParams.delivery, tip=this.bodyParams.tip, user =this.bodyParams.user;
        var paymentType = null;
        var instructions = null;
        var user = this.user.username;
        Meteor.call('orderCollection.insert', phone, cart, orderNum, deliveryType, paymentType, instructions, subtotal, tax, delivery, tip, user);
        return {"status": "success"}
      }
    });
      Api.addRoute('order2', {authRequired: true}, {
      post: function () {
        var phone = this.bodyParams.phone, cart= this.bodyParams.cart, orderNum= this.bodyParams.orderNum, deliveryType= this.bodyParams.deliveryType, paymentType= this.bodyParams.paymentType, instructions= this.bodyParams.instructions, subtotal=this.bodyParams.subtotal, tax=this.bodyParams.tax, delivery=this.bodyParams.delivery, tip=this.bodyParams.tip, user =this.bodyParams.user, userId =this.bodyParams.userId;
        console.log('ORDER2', cart)
        var user = this.user.username;
        Meteor.call('orderCollection.insert2', phone, cart, orderNum, deliveryType, paymentType, instructions, subtotal, tax, delivery, tip, user, userId);
        return {"status": "success"}
      }
    });
  }

