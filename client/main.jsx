// Client entry point, imports all client code

// import '/imports/startup/client';
// import '/imports/startup/both';

import React from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from "react-dom";

import App from '../imports/ui/App.js';

Meteor.startup(() => {
  ReactDOM.render(
      <App/>,
    document.getElementById("react-target")
  );
});