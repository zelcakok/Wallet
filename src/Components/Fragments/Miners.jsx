import React, { Component } from 'react';

//Material UI
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';

import BlockIcon from '@material-ui/icons/Dashboard';


//Libraries
import QRCode from 'qrcode.react';
import QrReader from "react-qr-reader";
import Swal from 'sweetalert2';
import crypto from 'crypto';
import moment from 'moment';

//Colors
import red from '@material-ui/core/colors/red';

import API from '../API';
import Authenticator from '../Authenticator';
import Loader from './Loader';

class Content extends Component {
  constructor(props){
    super(props);
    this.state = {
      preBlocks: null,
      addressBook: null
    }
  }

  setAddressBook=(addressBook)=>{
    this.setState({addressBook: addressBook});
  }

  setTransactions=(blockPayload)=>{
    if(blockPayload === null) {
      this.setState({preBlocks: null});
      return;
    }
    var payments = [];
    var payloads = JSON.parse(blockPayload);
    console.log(this.state.addressBook);
    for(var i=0; i < payloads.length; i++){
      var payment = JSON.parse(payloads[i]).payment;
      payment.payerName = this.state.addressBook[payment.payerAddr].email.split("@")[0];
      payment.payeeName = this.state.addressBook[payment.payeeAddr].email.split("@")[0];
      payments.push(payment);
    }
    this.setState({preBlocks: payments});
  }

  render(){
    if(this.state.preBlocks === null || this.state.preBlocks.length === 0)
      return <div style={{textAlign:"center", color:"grey", marginTop:"10%"}}>There is no transaction waiting for mining.</div>
    return (
      <Grid container spacing={8} justify="flex-start">
        {
          (this.state.preBlocks).map((payment)=>{
            return (
              <Grid item key={payment.id}>
                <Card style={{width:600}}>
                  <CardContent>
                    <Grid container spacing={16} direction="row" justify="flex-start" alignItems="center">
                      <Grid item xs={6} style={{fontWeight:"bold"}}>Payer</Grid>
                      <Grid item xs={6}>{payment.payerName}</Grid>
                      <Grid item xs={6} style={{fontWeight:"bold"}}>Payee</Grid>
                      <Grid item xs={6}>{payment.payeeName}</Grid>
                      <Grid item xs={6} style={{fontWeight:"bold"}}>Amount</Grid>
                      <Grid item xs={6}>{"HKD " + parseFloat(payment.amount).toFixed(2)}</Grid>
                      <Grid item xs={6} style={{fontWeight:"bold"}}>Date time</Grid>
                      <Grid item xs={6}>{moment(payment.timestamp).format("DD/MM/YY hh:mm:ss A")}</Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )
          })
        }
      </Grid>
    )
  }
}

class Miners extends Component {
  constructor(props){
    super(props);
    this.handler = props.handler;
    this.handler.eventEmitter.on("onDataUpdated", this.invalidate);
  }

  invalidate=()=>{
    if(this.content === null) return;
    this.content.setTransactions(this.handler.state.mining);
  }

  async componentDidMount(){
    try {
      if(await this.handler.fetchBlocks()){
        if(this.loader !== null){
          this.loader.dismiss(<Content ref={(content)=>this.content = content}/>, true);
          this.content.setAddressBook(this.handler.state.addressBook);
          this.invalidate();
        }
      } else {
        setTimeout(()=>{
          this.loader.dismiss(null, false);
        }, 1500);
      }
    } catch(err) {
      console.log(err);
      setTimeout(()=>{
        this.loader.dismiss(null, false, true);
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
export default Miners;
