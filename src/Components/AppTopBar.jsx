//ReactJS
import React, { Component } from 'react';

//Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

//Libraries
import Swal from 'sweetalert2';

//Colors
import red from '@material-ui/core/colors/red';

//Self Libraries
import Authenticator from './Authenticator';

class AppTopBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: "",
    }
    this.auth = Authenticator.getInstance();
    this.auth.isLoggedIn().then((cred)=>{
      if(cred) this.setState({username: cred.username})
    });
  }

  componentWillMount(){

  }

  componentDidMount(){

  }

  navLogin=()=>{
    if(this.state.username.length>0){
      Swal({
        title: 'Do you want to logout?',
        text: 'Thank you for using Wallet',
        type: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.value) {
          this.setState({username : ""});
          this.auth.signOut();
          window.location = "/";
        }
      })
    } else window.location = "/Login";
  }

  render(){
    return (
      <AppBar position="static" style={{backgroundColor:red[500]}}>
        <Toolbar>
          <Typography variant="h6" color="inherit" style={{flex:1}}>
            My Wallet
          </Typography>
          <IconButton color="inherit" onClick={this.navLogin}>
            <AccountCircleIcon style={{marginRight:"2px"}}/>
            <Typography variant="h6" color="inherit">
              {  this.state.username }
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
    )
  }
}
export default AppTopBar;
