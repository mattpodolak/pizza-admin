import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { withStyles, useTheme } from '@material-ui/core/styles';

import { compose} from 'redux'
import { withTracker } from 'meteor/react-meteor-data';
import { CustomerCollection } from '../../api/customers';

import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TablePagination from '@material-ui/core/TablePagination';
import TableBody from '@material-ui/core/TableBody';
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

class CustomersList extends React.Component {
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

    if(!Meteor.settings.public.customerdb.includes(Meteor.user().username)){
      return (
        <Typography variant="h6" noWrap>
        Customers DB Addon not added for your account.
      </Typography>
      );
    }

    return (
      <div>
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
            {this.props.customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer) => (
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
      <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={this.props.customers.length}
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