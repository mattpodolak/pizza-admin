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
import TablePagination from '@material-ui/core/TablePagination';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

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
    page: 0,
    rowsPerPage: 5
  }

  render(){
    const { classes } = this.props;
    const {
      open,
      buttonText,
      page,
      rowsPerPage
    } = this.state;

    if(!Meteor.settings.public.orderdb.includes(Meteor.user().username)){
      return (
        <Typography variant="h6" noWrap>
        Orders DB Addon not added for your account.
      </Typography>
      );
    }

    return (
      <div>
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
            {this.props.orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                <TableRow key={order._id}>
                <TableCell>{order.orderNum}</TableCell>
                <TableCell>{order.phone}</TableCell>
                {
                    order.cart.length > 0 &&
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
      <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={this.props.orders.length}
      rowsPerPage={rowsPerPage}
      page={page}
      backIconButtonProps={{
        'aria-label': 'previous page',
      }}
      nextIconButtonProps={{
        'aria-label': 'next page',
      }}
      onChangePage={this.handleChangePage}
      onChangeRowsPerPage={this.handleChangeRowsPerPage}
    />
    </div>
    );
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: event.target.value,
      page: 0
    })
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