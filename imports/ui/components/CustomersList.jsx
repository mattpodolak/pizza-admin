import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { withStyles, useTheme } from '@material-ui/core/styles';

import { compose} from 'redux'
import { withTracker } from 'meteor/react-meteor-data';
import { CustomerCollection } from '../../api/customers';

import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const drawerWidth = 240;
const styles = theme => ({
    seeMore: {
        marginTop: theme.spacing(3),
      },
});

class CustomersList extends React.Component {
  state = {
    open: false,
    setOpen: false,
  }

  render(){
    const { classes } = this.props;
    const {
      open,
      buttonText
    } = this.state;

    return (
        <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Address One</TableCell>
            <TableCell>Address Two</TableCell>
            <TableCell>Postal Code</TableCell>
            <TableCell>City</TableCell>
          </TableRow>
        </TableHead>
        {
            this.props.customers != null &&
            <TableBody>
            {this.props.customers.map((customer) => (
                <TableRow key={customer._id}>
                <TableCell>{customer.first_name}</TableCell>
                <TableCell>{customer.last_name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.address_one}</TableCell>
                <TableCell>{customer.address_two}</TableCell>
                <TableCell>{customer.postal_code}</TableCell>
                <TableCell>{customer.city}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        }
      </Table>
    );
  }

}

CustomersList.propTypes = {
  classes: PropTypes.object.isRequired,
};

// withStyles(styles, { withTheme: true });

export default compose(
  withStyles(styles, { withTheme: true }),
  withTracker((props) => {
    Meteor.subscribe('customerCollection');
    return {
      customers: CustomerCollection.find({user: Meteor.user().username}, {sort: { createdAt: -1 }}).fetch(),
    };
  })
)(CustomersList)