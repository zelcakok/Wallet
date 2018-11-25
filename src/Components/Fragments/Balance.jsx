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
      creditCardAddr: "",
      creditCardInputAmount: ""
    }
  }

  createData=(id, type, payer, payee, datetime, amount)=>{
    return { id, type, payer, payee, datetime, amount };
  }

  setLastUpdate=(timestamp)=>{
    this.setState({lastUpdate: moment(timestamp).format("DD/MM/YY hh:mm:ss A")})
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
        row = this.createData(paymentID, "Receive", payment.target, "You", moment(payment.timestamp).format("DD/MM/YY hh:mm A"), payment.delta);
      else
        row = this.createData(paymentID, "Pay", "You", payment.target, moment(payment.timestamp).format("DD/MM/YY hh:mm A"), Math.abs(payment.delta));
      tmp.push(row);
    })
    this.setState({ledger: tmp});
  }

  render(){
    return (
      <div>
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
              <Grid
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
              >
                <Grid item xs={8}>
                  <TextField id="payeeAddr" placeholder="Type the credit card number here." fullWidth
                             label="Credit card number" fullWidth
                             value={this.state.creditCardAddr} required
                             onChange={this.updateCreditCardAddr}
                             margin="normal" variant="outlined"/>
                </Grid>
                <Grid item xs={4}>
                  <TextField id="amount" label="Security Code"
                             placeholder="000 / 0000" fullWidth
                             onChange={this.updateCreditCardInputAmount}
                             value={this.state.creditCardInputAmount} type="number"
                             InputLabelProps={{ shrink: true, min: 0, step: 0 }}
                             margin="normal" variant="outlined"/>
                </Grid>
              </Grid>
              <TextField id="amount" label="Amount"
                         placeholder="HKD 0.00" fullWidth
                         onChange={this.updatePaymentAmount}
                         value={this.state.paymentAmount} type="number"
                         InputLabelProps={{ shrink: true, min: 0, step: 1 }}
                         margin="normal" variant="outlined"/>

              <Divider style={{marginTop:"5%", marginBottom:"2%"}}/>

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
                    <Button style={{color:red[500]}} variant="outlined" onClick={this.payment}>Transfer</Button>
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
    this.state = {
      credential: null,
      isLoggedIn : false
    }
    this.auth = Authenticator.getInstance();
    this.auth.isLoggedIn().then((cred)=>{
      if(cred) this.setState({credential: cred, isLoggedIn: true})
    });
  }

  componentWillMount(){

  }

  async componentDidMount(){
    var cred = await this.auth.isLoggedIn();
    if(cred){
      this.setState({credential: cred, isLoggedIn: true});
      var response = await API.profile();
      if(this.loader !== null){
        this.loader.dismiss(<Content ref={(content)=>this.content = content}/>, true);
        this.content.setLastUpdate(response.data.ledger.lastUpdate);
        this.content.setAvailBalance(response.data.ledger.balance);
        this.content.setLedger(response.data.ledger.ledger);
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
export default Balance;
