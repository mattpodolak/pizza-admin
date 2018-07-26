import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import './login.html';

Template.App_login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password);
    }
});

