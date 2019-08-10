import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { withStyles, useTheme } from '@material-ui/core/styles';

import { compose} from 'redux'
import { withTracker } from 'meteor/react-meteor-data';
import { OrderCollection } from '../../api/customers';

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

class OrdersList extends React.Component {
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
            <TableCell>Order Number</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Delivery Type</TableCell>
            <TableCell>Payment Type</TableCell>
            <TableCell align="right">Subtotal</TableCell>
          </TableRow>
        </TableHead>
        {
            this.props.orders != null &&
            <TableBody>
            {this.props.orders.map((order) => (
                <TableRow key={order._id}>
                <TableCell>{order.orderNum}</TableCell>
                <TableCell>{order.phone}</TableCell>
                {
                    order.cart.length > 1 &&
                    <TableCell>
                    {
                    order.cart.map(cart => (
                        ' - ' + cart.itemName
                    ))}
                    </TableCell>
                }
                {
                    order.cart.length == 1 &&
                    <TableCell>{order.cart.itemName}</TableCell>
                }
                <TableCell>{order.deliveryType}</TableCell>
                <TableCell>{order.paymentType}</TableCell>
                <TableCell align="right">{order.subtotal}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        }
      </Table>
    );
  }

}

OrdersList.propTypes = {
  classes: PropTypes.object.isRequired,
};

// withStyles(styles, { withTheme: true });

export default compose(
  withStyles(styles, { withTheme: true }),
  withTracker((props) => {
    Meteor.subscribe('orderCollection');
    return {
      orders: OrderCollection.find({user: Meteor.user().username}, {sort: { createdAt: -1 }}).fetch(),
    };
  })
)(OrdersList)