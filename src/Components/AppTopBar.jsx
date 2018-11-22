import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

class AppTopBar extends Component {
  render(){
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" style={{flex:1}}>
              Wallet
            </Typography>
            <IconButton color="inherit">
              <AccountCircleIcon style={{marginRight:"2px"}}/>
              <Typography variant="h6" color="inherit">
                Login
              </Typography>
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}
export default AppTopBar;
