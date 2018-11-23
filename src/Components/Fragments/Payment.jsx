import React, { Component } from 'react';

//Material UI
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

//Libraries
import QRCode from 'qrcode.react';
import QrReader from "react-qr-reader";

//Colors
import red from '@material-ui/core/colors/red';

import Intermediate from '../Intermediate';
import API from '../API';
import Authenticator from '../Authenticator';
import Loader from './Loader';

class Content extends Component {
  constructor(props){
    super(props);
    this.state = {
      isScannerEnabled: false,
      delay: 300,
      payeeAddr: "",
      paymentAmount: "",
      walletAddr: ""
    }
    this.handleScan = this.handleScan.bind(this);
  }

  setWalletAddr=(walletAddr)=>{
    this.setState({walletAddr: walletAddr});
  }

  updatePayeeAddr=(event)=>{
    this.setState({payeeAddr:event.target.value});
  }

  updatePaymentAmount=(event)=>{
    this.setState({paymentAmount:event.target.value});
  }

  toggleScanner=()=>{
    this.setState({isScannerEnabled: !this.state.isScannerEnabled});
  }

  clearForm=()=>{
    this.setState({payeeAddr: "", paymentAmount: ""})
  }

  handleScan(data) {
    if (data)
      this.setState({payeeAddr: data, isScannerEnabled: false});
  }

  handleError=(err)=>{
    alert("QR code scanner requires a camera.");
    this.toggleScanner()
  }

  render(){
    return (
      <div>
        <Card style={{marginBottom:"2%"}}>
          <CardHeader
            avatar = {
              <Avatar style={{backgroundColor: red[500]}}>
                <CreditCardIcon/>
              </Avatar>
            }
            title="Create a payment" subheader="The transaction will be created within 10 minutes"/>
          <CardContent>
            <form noValidate autoComplete="off">
              {
                this.state.isScannerEnabled ?
                <QrReader
                  delay={this.state.delay}
                  onError={this.handleError}
                  onScan={this.handleScan}
                  style={{ width: "100%" }}
                />  : null
              }
              <TextField id="payeeAddr" placeholder="Type or scan the payee wallet address." fullWidth
                         label="Payee wallet address"
                         value={this.state.payeeAddr} required
                         onChange={this.updatePayeeAddr}
                         margin="normal" variant="outlined"/>
              <TextField id="amount" label="Amount"
                         placeholder="HKD 0.00" fullWidth
                         onChange={this.updatePaymentAmount}
                         value={this.state.paymentAmount} type="number"
                         InputLabelProps={{ shrink: true, min: 0, step: 1 }}
                         margin="normal" variant="outlined"/>

              <Divider style={{marginTop:"5%", marginBottom:"2%"}}/>
              <Grid container direction="row">
                <Grid item>
                  <Button variant="outlined" onClick={this.toggleScanner}>Scan QR Code</Button>
                </Grid>
                <Grid item xs>
                  <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                  >
                  <Grid item style={{marginLeft:"2%"}}>
                    <Button variant="outlined" onClick={this.clearForm}>Clear</Button>
                  </Grid>
                  <Grid item style={{marginLeft:"2%"}}>
                    <Button style={{color:red[500]}} variant="outlined">Pay</Button>
                  </Grid>
                  </Grid>
                </Grid>
              </Grid>


            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            avatar = {
              <Avatar style={{backgroundColor: red[500]}}>
                <AccountBalanceWalletIcon/>
              </Avatar>
            }
            title="Receive a payment" subheader="Show QR code to the payer."/>
          <CardContent style={{textAlign:"center"}}>
            <QRCode value={this.state.walletAddr} />
          </CardContent>
        </Card>
      </div>
    )
  }
}

class Payment extends Component {
  constructor(props){
    super(props);
    this.state = {
      credential: null,
      isLoggedIn: false,
      profile: null
    }
    this.auth = Authenticator.getInstance();
  }

  componentWillMount(){
    this.auth.isLoggedIn().then((cred)=>{
      if(cred) {
        this.setState({credential: cred, isLoggedIn: true})
      }
    });
  }

  async componentDidMount(){
    var cred = await this.auth.isLoggedIn();
    if(cred){
      this.setState({credential: cred, isLoggedIn: true});
      var response = await API.profile(cred.uid);
      if(this.loader !== null){
        this.loader.dismiss(<Content ref={(content)=>this.content = content}/>, true);
        this.content.setWalletAddr(response.data.walletAddr);
      }
    }
  }

  componentWillUnMount(){

  }

  render(){
    return (
      <div>
        <Loader ref={(loader)=>this.loader = loader}/>
      </div>
    )
  }
}
export default Payment;
