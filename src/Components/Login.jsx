//ReactJS
import React, { Component } from 'react';

//Material UI
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import KeyIcon from '@material-ui/icons/VpnKey';
import red from '@material-ui/core/colors/red';

//Libraries
import Swal from 'sweetalert2';
import crypto from 'crypto';

//Self Libraries
import Authenticator from './Authenticator';
import API from './API';

class Login extends Component {
  constructor(props){
    super(props);
    this.auth = Authenticator.getInstance();
    this.state = {
      email: "",
      password: ""
    }
  }

  updateEmail=(event)=>{
    this.setState({email: event.target.value});
  }

  updatePassword=(event)=>{
    this.setState({password: event.target.value});
  }

  login=(event)=>{
    event.preventDefault()
    var email = this.state.email;
    var password = this.state.password;
    var digest = crypto.createHash("sha256").update(email+password).digest("hex");
    API.verify(digest).then((result)=>{
      Swal({
        title: 'Please wait....',
        showCancelButton: false,
      })
      if(result.data === true){
        this.emailAuth(email, password).then((cred)=>{
          window.location = "/";
        });
      }
      else
        Swal({
          title: 'Login failure',
          text: 'Wrong username or password',
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Dismiss'
        })
    }).catch((err)=>{
      Swal({
        title: 'Login failure',
        text: err,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Dismiss'
      })
    })
  }

  emailAuth(email, password){
    return this.auth.auth.signInWithEmailAndPassword(email, password);
  }

  backToHome=()=>{
    window.location = "/";
  }

  render(){
    return (
      <div style={{float:"none", margin:"auto", maxWidth:600,width:window.innerWidth * 0.9, marginTop:"10%"}}>
        <Card>
          <CardHeader
            avatar={
              <Avatar style={{backgroundColor:red[500]}}>
                <KeyIcon/>
              </Avatar>
            }
            title="Login"
            subheader="Welcome to Wallet"/>
          <CardContent>
            <form>
              <TextField id="email" placeholder="Please enter the email address here." fullWidth
                         label="Email address of your Wallet" required
                         type="email"
                         value={this.state.email}
                         onChange={this.updateEmail}
                         margin="normal" variant="outlined"/>
              <TextField id="password" placeholder="Please enter the password here." fullWidth
                         label="Password of your Wallet" required
                         type="password"
                         value={this.state.password}
                         onChange={this.updatePassword}
                         margin="normal" variant="outlined"/>
               <Divider style={{marginTop:"5%", marginBottom:"2%"}}/>
               <Grid container direction="row" justify="flex-end">
                 <Grid item>
                   <Button variant="outlined" onClick={this.backToHome}>Cancel</Button>
                 </Grid>
                 <Grid item>
                   <Button type="submit" variant="outlined" style={{color:red[500], marginLeft:"10%"}} onClick={this.login}>Login</Button>
                 </Grid>
               </Grid>
             </form>
          </CardContent>
        </Card>
      </div>
    )
  }
}
export default Login;
