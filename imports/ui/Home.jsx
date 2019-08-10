import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { withStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MailIcon from '@material-ui/icons/Mail';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import { Bert } from 'meteor/themeteorchef:bert';
import queryString from 'query-string'
import { compose} from 'redux'
import { withTracker } from 'meteor/react-meteor-data';
import { StripeTokenCollection } from '../api/customers';
import { Link } from 'react-router-dom';

const drawerWidth = 240;
const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  button: {
    margin: theme.spacing(1),
  },
  theme: {
    direction: theme.direction
  }
});

class Home extends React.Component {
  state = {
    open: false,
    setOpen: false,
    loading: false,
    token: false,
    urlValues: queryString.parse(this.props.location.search),
    buttonText: 'Finish Stripe Link'
  }

  render(){
    const { classes } = this.props;
    const {
      open,
      buttonText
    } = this.state;

    const connectStripeButton = (
      <Button 
      variant="contained" 
      color="primary" 
      className={classes.button}
      href="https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_FYGj8PVp7Y8VaLAwIxZ5qyRsbtySQuAf&scope=read_write&redirect_uri=https://pizza-admin.herokuapp.com/home"        
      >
        Link Stripe Account
      </Button>
    );

    const finishConnectButton = (
      <Button 
      variant="contained" 
      color="primary" 
      className={classes.button}
      onClick={() => this.linkStripe()}
      >
        {buttonText}
      </Button>
    );

    const stripeConnected = (
      <Typography component="h1" variant="h5">
      Connected to Stripe
      </Typography>  
    );

    const connectError = (
      <Typography component="h1" variant="h5">
      {this.state.urlValues.error_description}
      </Typography>  
    );

    const connectStripe = (
      <div>
      {
        this.state.urlValues.code == null &&
        //Not yet started oauth connection
        connectStripeButton
      }
      {
        this.state.urlValues.code != null &&
        //Oauth finished - need to save in db
        finishConnectButton
      }
      {
        this.state.urlValues.error != null &&
        //Oauth error occured
        connectError
      }
      </div>
    );

    const stripeButton = (
      <div>
      {
        this.props.token == null &&
        //No token found in db
        connectStripe
      }
      {
        this.props.token != null &&
        stripeConnected
      }
      </div>
    );

    return (
      <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={this.handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Home
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            {classes.theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button component={Link} to="/home">
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/profile">
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button component={Link} to="/orders">
            <ListItemIcon><MailIcon /></ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
          <ListItem button component={Link} to="/customers">
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Typography component="h1" variant="h5">
          Pizza Admin
        </Typography>  
        {stripeButton}
      </main>
    </div>
    );
  }
  handleDrawerOpen = () => {
    this.setState({
      open: true
    });
  }
  handleDrawerClose = () => {
    this.setState({
      open: false
    });
  }

  changeButton = (buttonText) => {
    this.setState({ buttonText }); 
  } 

  linkStripe = () => {
    this.setState({ sendingOrder: true }); 
    this.changeButton("Linking..");

    const auth_code = this.state.urlValues.code

    Meteor.call("stripeTokenCollection.insert", auth_code, (error, result) => {
      if (!error && result){
        //link stripe acct to admin acct
        this.changeButton("Linked");
      }
      else{
        this.changeButton("Error: Try Again");
      }
    });
  };
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

// withStyles(styles, { withTheme: true });

export default compose(
  withStyles(styles, { withTheme: true }),
  withTracker((props) => {
    Meteor.subscribe('stripeTokenCollection');
    return {
      token: StripeTokenCollection.findOne({user: Meteor.userId()}),
    };
  })
)(Home)