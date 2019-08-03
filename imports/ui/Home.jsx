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
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Button from '@material-ui/core/Button';
import { Bert } from 'meteor/themeteorchef:bert';
import queryString from 'query-string'
import { compose} from 'redux'
import { withTracker } from 'meteor/react-meteor-data';
import { StripeTokenCollection } from '../api/customers';

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
      href="https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_FYGjLVzSTFc7fhWCKmpBCxFJz3lnb8GY&scope=read_write&redirect_uri=http://localhost:3000/home"        
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

    // function ConnectStripe(){
    //   try{
    //     if(this.props.token[0] !=null){
    //       //token exists for user
    //       return stripeConnected
    //     }
    //   }
    //   catch{
    //     console.log('Error with token db item')
    //   }
    //   console.log(this.state.urlValues)
    //   try{
    //     if(this.state.urlValues.code != null){
    //       console.log(this.state.urlValues)
    //       //connecting to Stripe
    //       return connectingStripe  
    //     }
    //   }
    //   catch{
    //     console.log('Error with URL param from Stripe')
    //   }
    //   return stripeButton
    // }
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
          {['Profile'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon><InboxIcon /></ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Dashboard'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon><MailIcon /></ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
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