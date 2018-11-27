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
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import MoneyIcon from '@material-ui/icons/AttachMoney';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AtmIcon from '@material-ui/icons/Atm';

import crypto from 'crypto';
import Swal from 'sweetalert2';
import moment from 'moment';

//Colors
import red from '@material-ui/core/colors/red';

import Loader from './Loader';
import Authenticator from '../Authenticator';
import API from '../API';

class Content extends Component {
  constructor(props){
    super(props);
    this.state = {
      walletAddr: "",
      availBalance: 0,
      ledger: [],
      lastUpdate: "",
      transferAmount: "",
      walletBankWalletAddr: ""
    }
    this.auth = Authenticator.getInstance();
  }

  createData=(id, type, payer, payee, datetime, amount)=>{
    return { id, type, payer, payee, datetime, amount };
  }

  setLastUpdate=(timestamp)=>{
    this.setState({lastUpdate: moment(timestamp).format("DD/MM/YY hh:mm:ss A")})
  }

  setWalletBankWalletAddr=(walletAddr)=>{
    this.setState({walletBankWalletAddr: walletAddr});
  }

  setWalletAddr=(walletAddr)=>{
    this.setState({walletAddr: walletAddr});
  }

  setAvailBalance=(balance)=>{
    this.setState({availBalance: balance});
  }

  setLedger=(ledger)=>{
    var tmp = this.state.ledger;
    Object.keys(ledger).map((paymentID)=>{
      var row = null;
      var payment = ledger[paymentID];
      if(payment.delta > 0)
        row = this.createData(paymentID, "Receive", payment.name, "You", moment(payment.timestamp).format("DD/MM/YY hh:mm A"), payment.delta);
      else
        row = this.createData(paymentID, "Pay", "You", payment.name, moment(payment.timestamp).format("DD/MM/YY hh:mm A"), Math.abs(payment.delta));
      tmp.push(row);
    })
    this.setState({ledger: tmp});
  }

  updateTransferAmount=(event)=>{
    this.setState({transferAmount: event.target.value});
  }

  clearForm=()=>{
    this.setState({transferAmount: ""});
  }

  validation=()=>{
    var valid = {status: true, message: ""};
    var amount = this.state.transferAmount;

    if(amount === "" || amount < 0) { valid.status = false; valid.message = "Please specify a valid amount.";}

    if(!valid.status){
      Swal({
        title: 'Transfer Error',
        text: valid.message,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Dismiss',
      }).then(()=>{return false})
    } else return true;
  }

  transfer=()=>{
    if(!this.validation()) return;
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
      var payeeEmail = await this.auth.isLoggedIn();
      var email = "walletbank@blockchain.com";
      var password = result.value;
      var digest = crypto.createHash("sha256").update(payeeEmail+password).digest("hex");
      var payerAddr = this.getWalletBankWalletAddr();
      var payeeAddr = this.state.walletAddr;
      var amount = this.state.transferAmount;
      API.transfer({
        digest: digest,
        payerAddr: payerAddr,
        payeeAddr: payeeAddr,
        amount: amount
      }).then((response)=>{
        if(!response.data.status) {
          Swal({
            title: 'Transfer Error',
            text: response.data.message,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Dismiss',
          })
        }
        else {
          Swal({
            title: 'Transfer created successfully',
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
                <MoneyIcon/>
              </Avatar>
            }
            title="Balance" subheader={"Last update: " + this.state.lastUpdate}/>
          <CardContent style={{textAlign:"center"}}>
            <Grid container direction="row" justify="space-between">
              <Grid item>
                <Typography variant="h5">Available balance</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5">HKD {parseFloat(this.state.availBalance).toFixed(2)}</Typography>
              </Grid>
            </Grid>
            <Divider style={{margin:"2%"}}/>
            <Paper style={{overflowX:"auto"}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction</TableCell>
                    <TableCell>Payer</TableCell>
                    <TableCell>Payee</TableCell>
                    <TableCell>Date time</TableCell>
                    <TableCell numeric>Amount (HKD)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    this.state.ledger.length > 0 ?
                      this.state.ledger.map(row => {
                      return (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.type}
                          </TableCell>
                          <TableCell>{row.payer}</TableCell>
                          <TableCell>{row.payee}</TableCell>
                          <TableCell>{row.datetime}</TableCell>
                          <TableCell
                            style={{color: row.type==="Pay"? red[500] : ""}}
                            numeric>
                            {
                              row.type === "Pay" ?
                              "("+row.amount.toFixed(2)+")" : row.amount.toFixed(2)
                            }
                          </TableCell>
                        </TableRow>
                      )})
                      :
                      <TableRow>
                        <TableCell colSpan="5" style={{textAlign:"center", color:"grey"}}>
                          There is no transactions.
                        </TableCell>
                      </TableRow>
                  }
                </TableBody>
              </Table>
            </Paper>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            avatar = {
              <Avatar style={{backgroundColor: red[500]}}>
                <AtmIcon/>
              </Avatar>
            }
            title="Top Up Balance" subheader="Transfer money to your wallet."/>
          <CardContent style={{textAlign:"center"}}>
            <form noValidate autoComplete="off">
              <TextField id="amount" label="Amount"
                         placeholder="HKD 0.00" fullWidth
                         onChange={this.updateTransferAmount}
                         value={this.state.transferAmount} type="number"
                         InputLabelProps={{ shrink: true, min: 0, step: 1 }}
                         margin="normal" variant="outlined"/>
              <Divider style={{marginTop:"1%", marginBottom:"2%"}}/>
              <Grid container direction="row">
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
                    <Button style={{color:red[500]}} variant="outlined" onClick={this.transfer}>Transfer</Button>
                  </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }
}

class Balance extends Component {
  constructor(props){
    super(props);
    this.handler = props.handler;
  }

  async componentDidMount(){
    if(await this.handler.fetchProfile()){
      if(this.loader !== null){
        this.loader.dismiss(<Content ref={(content)=>this.content = content}/>, true);
        this.content.setLastUpdate(this.handler.state.profile.ledger.lastUpdate);
        this.content.setAvailBalance(this.handler.state.profile.ledger.balance);
        this.content.setLedger(this.handler.state.profile.ledger.ledger);
        this.content.setWalletAddr(this.handler.state.profile.walletAddr);
        this.content.getWalletBankWalletAddr = this.handler.getWalletBankWalletAddr;
      }
    } else {
      setTimeout(()=>{
        this.loader.dismiss(null, false);
      }, 1500);
    }
  }

  render(){
    return (
      <div>
        <Loader ref={(loader)=>this.loader = loader}/>
      </div>
    )
  }
}
export default Balance;
