import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import './navigation.html';

Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('App.login');
    }
});