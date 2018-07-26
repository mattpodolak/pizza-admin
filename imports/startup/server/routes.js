import { Router } from 'meteor/iron:router'

Router.route('/item', function () {
    var req = this.request;
    var res = this.response;
    res.end('hello from the server\n');
}, {where: 'server'});