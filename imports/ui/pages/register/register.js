import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base'
import './register.html';

Template.App_register.events({
    'submit form': function(event){
        event.preventDefault();
        var username = $('[name=username]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
            username: username,
            password: password
        });
        Router.go('App.customers');
    }
});