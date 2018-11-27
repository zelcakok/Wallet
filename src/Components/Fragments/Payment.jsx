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
import Swal from 'sweetalert2';
import crypto from 'crypto';

//Colors
import red from '@material-ui/core/colors/red';

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
    this.auth = Authenticator.getInstance();
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

  validation=()=>{
    var valid = {status: true, message: ""};
    var payerAddr = this.state.walletAddr;
    var payeeAddr = this.state.payeeAddr;
    var amount = this.state.paymentAmount;

    if(payerAddr.length === 0) { valid.status = false; valid.message = "System error: Wallet address is empty";}
    else if(payeeAddr.length === 0 || payeeAddr === this.state.walletAddr) { valid.status = false; valid.message = "The payee address contains error.";}
    else if(amount === "" || amount < 0) { valid.status = false; valid.message = "Please specify a valid amount.";}

    if(!valid.status){
      Swal({
        title: 'Payment Error',
        text: valid.message,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Dismiss',
      }).then(()=>{return false})
    } else return [payerAddr, payeeAddr, amount];
  }

  payment=()=>{
    var form = this.validation();
    if(!form) return;
    Swal({
      title: 'Verification',
      text: 'The transaction will be settled in 10 minutes.',
      input: 'password',
      inputPlaceholder: 'Please enter your password here.',
      type: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if(result.hasOwnProperty("dismiss")) return;
      var email = await this.auth.isLoggedIn();
      email = email.username + "@blockchain.com";
      var password = result.value;
      var digest = crypto.createHash("sha256").update(email+password).digest("hex");
      var payerAddr = this.state.walletAddr;
      var payeeAddr = this.state.payeeAddr;
      var amount = this.state.paymentAmount;
      API.payment({
        digest: digest,
        payeeAddr: payeeAddr,
        amount: amount
      }).then((response)=>{
        if(!response.data.status) {
          Swal({
            title: 'Payment Error',
            text: response.data.message,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Dismiss',
          })
        }
        else {
          Swal({
            title: 'Payment created successfully',
            text: 'The transaction will be settled in 10 minutes.',
            type: 'info',
            showCancelButton: false,
            confirmButtonText: 'Dismiss',
          }).then(()=>this.clearForm())
        }
      })
    })
  }

  render(){
    return (
      <div style={{maxWidth: 1200, float:"none", margin:"auto"}}>
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
                         InputLabelProps={{ shrink: true }}
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
                    <Button style={{color:red[500]}} variant="outlined" onClick={this.payment}>Pay</Button>
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
    this.handler = props.handler;
  }

  async componentDidMount(){
    if(await this.handler.fetchProfile()){
      if(this.loader !== null){
        this.loader.dismiss(<Content ref={(content)=>this.content = content}/>, true);
        this.content.setWalletAddr(this.handler.state.profile.walletAddr);
      }
    } else {
      setTimeout(()=>{
        this.loader.dismiss(null, false);
      }, 1500);
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
