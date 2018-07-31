import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import './login.html';

Template.App_login.events({
    'submit form': function(event){
        event.preventDefault();
        var username = $('[name=username]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(username, password);
        Router.go('App.home');
    }
});

