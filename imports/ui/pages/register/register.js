import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base'
import './register.html';

Template.App_register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
            email: email,
            password: password
        });
        Router.go('App.customers');
    }
});