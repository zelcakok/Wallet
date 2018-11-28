//ReactJS
import React, { Component } from 'react';

//Material UI
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

//Libraries
import moment from 'moment';

//Self Libraries
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
                <Card style={{width: window.innerWidth > 600 ? 600 : window.innerWidth * 0.95}}>
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
