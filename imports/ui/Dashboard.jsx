import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { withStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
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
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Bert } from 'meteor/themeteorchef:bert';
import queryString from 'query-string'
import { compose} from 'redux'
import { withTracker } from 'meteor/react-meteor-data';
import { StripeTokenCollection } from '../api/customers';
import { Link } from 'react-router-dom';
import Deposits from './Deposits';
import Taxes from './Taxes';
import Title from './Title';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import { HTTP } from 'meteor/http';

const drawerWidth = 240;
const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
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
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
});

class Dashboard extends React.Component {
  state = {
    open: false,
    setOpen: false,
    buttonText: 'Submit Menu Changes',
    menu: {
      pizza_deals: [],
      specialty: [],
      freedelivery: [],
      wingsandsandwiches: [],
      salads: [],
      sides: [],
      pitas: []
    }
  }

  componentDidMount() {
    HTTP.call('GET', 'https://www.ordernapolipizza.ca/api/menu', (error, result) => {
      if (!error) {
        this.setState({
          menu: result.data.menu
        });
      }
    });
  }

  render(){
    const { classes } = this.props;
    const {
      open,
      buttonText,
      menu
    } = this.state;

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

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
            Dashboard
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
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits />
              </Paper>
            </Grid>
            {/* Recent Taxes */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Taxes />
              </Paper>
            </Grid>
            {/* Menu Management */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Title>Menu Management</Title>
                <Button variant="contained" color="secondary" className={classes.button} onClick={() => this.submitMenu()}>
                  {buttonText}
                </Button>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Free Delivery</FormLabel>
                  <FormGroup>
                    {     
                        this.state.menu.freedelivery.map((menuItem) => (
                          <FormControlLabel
                          control={<Switch checked={menuItem.active} onChange={this.handleChange('freedelivery', menuItem.name)} value={menuItem.name} />}
                          label={menuItem.name}
                        />
                        ))
                    }
                  </FormGroup>
                  <FormLabel component="legend">Pizza Deals</FormLabel>
                  <FormGroup>
                    {     
                        this.state.menu.pizza_deals.map((menuItem) => (
                          <FormControlLabel
                          control={<Switch checked={menuItem.active} onChange={this.handleChange('pizza_deals', menuItem.name)} value={menuItem.name} />}
                          label={menuItem.name}
                        />
                        ))
                    }
                  </FormGroup>
                  <FormLabel component="legend">Specialty Pizza</FormLabel>
                  <FormGroup>
                    {     
                        this.state.menu.specialty.map((menuItem) => (
                          <FormControlLabel
                          control={<Switch checked={menuItem.active} onChange={this.handleChange('specialty', menuItem.name)} value={menuItem.name} />}
                          label={menuItem.name}
                        />
                        ))
                    }
                  </FormGroup>
                  <FormLabel component="legend">Wings and Sandwiches</FormLabel>
                  <FormGroup>
                    {     
                        this.state.menu.wingsandsandwiches.map((menuItem) => (
                          <FormControlLabel
                          control={<Switch checked={menuItem.active} onChange={this.handleChange('wingsandsandwiches', menuItem.name)} value={menuItem.name} />}
                          label={menuItem.name}
                        />
                        ))
                    }
                  </FormGroup>
                  <FormLabel component="legend">Salads</FormLabel>
                  <FormGroup>
                    {     
                        this.state.menu.salads.map((menuItem) => (
                          <FormControlLabel
                          control={<Switch checked={menuItem.active} onChange={this.handleChange('salads', menuItem.name)} value={menuItem.name} />}
                          label={menuItem.name}
                        />
                        ))
                    }
                  </FormGroup>
                  <FormLabel component="legend">Sides</FormLabel>
                  <FormGroup>
                    {     
                        this.state.menu.sides.map((menuItem) => (
                          <FormControlLabel
                          control={<Switch checked={menuItem.active} onChange={this.handleChange('sides', menuItem.name)} value={menuItem.name} />}
                          label={menuItem.name}
                        />
                        ))
                    }
                  </FormGroup>
                  <FormLabel component="legend">Pitas</FormLabel>
                  <FormGroup>
                    {     
                        this.state.menu.pitas.map((menuItem) => (
                          <FormControlLabel
                          control={<Switch checked={menuItem.active} onChange={this.handleChange('pitas', menuItem.name)} value={menuItem.name} />}
                          label={menuItem.name}
                        />
                        ))
                    }
                  </FormGroup>
                  <FormHelperText>Update when store is closed.</FormHelperText>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
    );
  }
  handleChange = (category, name) => event => {
    var index = 0;
    for(var i=0; this.state.menu[category].length; i++){
      if(this.state.menu[category][i].name == name){
        console.log(this.state.menu[category][i].name)
        index = i;
        break;
      }
    }
    this.setState(prevState => {
      let menu = Object.assign({}, prevState.menu);               // creating copy of state variable menu
      menu[category][index].active = !menu[category][index].active; // update the active property              
      return { menu };                                            // return new object menu object
    })
  };

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
  submitMenu = () => {
    this.changeButton('Saving')
    HTTP.call('POST', 'https://www.ordernapolipizza.ca/api/menu', {
      data:{
        menu: this.state.menu
      }
    }, (error, result) => {
      console.log(result)
      if (!error) {
        this.changeButton('Saved')
      }
      else{
        this.changeButton('Error: Try Again')
      }
    });
  }
}

Dashboard.propTypes = {
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
)(Dashboard)