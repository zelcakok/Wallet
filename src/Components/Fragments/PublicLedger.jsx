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
      blockDetails: "",
      transDetails: "",
      blocks: null,
      sortedBlockKeys: null,
      addressBook: null
    }
  }

  setAddressBook=(addressBook)=>{
    this.setState({addressBook: addressBook});
  }

  setSortedBlockKeys=(keys)=>{
    this.setState({sortedBlockKeys: keys});
  }

  setBlocks=(blocks)=>{
    this.setState({blocks: blocks});
  }

  getCardWidth=()=>{
    if(window.innerWidth > 1000) return 700;
    else return window.innerWidth * 0.95;
  }

  genBlockCard=(blockAddr, block)=>{
    return (
      <Card key={blockAddr+"_card"} style={{marginBottom:"2%", width:this.getCardWidth(), overflowX:"auto"}}>
        <CardHeader
          avatar = {
            <Avatar style={{backgroundColor: red[500]}}>
              <BlockIcon/>
            </Avatar>
          }
          title={
            <Grid container justify="flex-start">
              <Grid item xs={2}>
                <div>Block address</div>
              </Grid>
              <Grid item>
                <div>{blockAddr}</div>
              </Grid>
            </Grid>
          }
          subheader={
            <div>
              <Grid container justify="flex-start">
                <Grid item xs={2}>
                  <div>Block hash</div>
                </Grid>
                <Grid item>
                  <div>{block.hash}</div>
                </Grid>
              </Grid>
              <Grid container justify="flex-start">
                <Grid item xs={2}>
                  <div>Previous hash</div>
                </Grid>
                <Grid item>
                  <div>{block.prevHash ? block.prevHash : "No previous block for the genesis block."}</div>
                </Grid>
              </Grid>
            </div>
          }/>
        <Divider style={{marginLeft:"2%", marginRight:"2%"}}/>
        <CardActions>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Button variant="outlined" style={this.getBlockBtnStyle(blockAddr)} onClick={()=>this.toggleBlockDetails(blockAddr)}>Block Details</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" style={this.getTransBtnStyle(blockAddr)} onClick={()=>this.toggleTransDetails(blockAddr)}>Transaction Details</Button>
            </Grid>
          </Grid>
        </CardActions>
        {
          this.state.blockDetails === blockAddr ?
            <CardContent>
              { this.fillBlockInfo(blockAddr, block) }
            </CardContent>  : null
        }
        {
          this.state.transDetails === blockAddr ?
            <CardContent>
              { this.fillTransInfo(blockAddr, block) }
            </CardContent>  : null
        }
      </Card>
    )
  }

  getTransBtnStyle=(blockAddr)=>{
    var isActive = this.state.transDetails === blockAddr;
    return {
      color: isActive ? "white" : red[500],
      backgroundColor: isActive ? red[400] : "white"
    }
  }

  getBlockBtnStyle=(blockAddr)=>{
    var isActive = this.state.blockDetails === blockAddr;
    return {
      color: isActive ? "white" : red[500],
      backgroundColor: isActive ? red[400] : "white"
    }
  }

  fillBlockInfo=(blockAddr, block)=>{
    return (
      <div style={{padding:"1%"}} key={blockAddr+"_info"}>
        <TextField style={{marginBottom:"2%"}} variant="outlined" label="Block Address" value={blockAddr} fullWidth disabled/>
        <TextField style={{marginBottom:"2%"}} variant="outlined" label="Hash of block" value={block.hash} fullWidth disabled/>
        <TextField style={{marginBottom:"2%"}} variant="outlined" label="Hash of previous block" value={block.prevHash ? block.prevHash : "No previous block for the genesis block."} fullWidth disabled/>
        <TextField style={{width:"50%"}} variant="outlined" label="Time of creation (24)" value={moment(block.timestamp).format("DD/MM/YY HH:mm:ss")} fullWidth disabled/>
        <TextField style={{width:"20%"}} variant="outlined" label="Target" value={block.target ? block.target : "NUL"} fullWidth disabled/>
        <TextField style={{width:"30%"}} variant="outlined" label="Nonce" value={block.nonce ? block.nonce : "NUL"} fullWidth disabled/>
        <TextField style={{marginTop:"2%"}} variant="outlined" label="Merkle Root" value={block.merkleRoot ? block.merkleRoot : "There is no transaction."} fullWidth disabled/>
      </div>
    )
  }

  fillTransInfo=(blockAddr, block)=>{
    if(!block.hasOwnProperty("payload"))
      return (
        <div style={{color:"grey", textAlign:"center"}}>There is no transaction.</div>
      )
    var payload = JSON.parse(block.payload);
    var payment = payload.payment;
    return (
      <Paper style={{overflowX:"auto"}}>
        <Table style={{maxWidth:window.innerWidth*0.5+"px"}}>
          <TableHead>
            <TableRow>
              <TableCell>Payer</TableCell>
              <TableCell>Payee</TableCell>
              <TableCell>Date time</TableCell>
              <TableCell numeric>Amount (HKD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={payment.id}>
              <TableCell>{this.state.addressBook[payment.payerAddr].email.split("@")[0]}</TableCell>
              <TableCell>{this.state.addressBook[payment.payeeAddr].email.split("@")[0]}</TableCell>
              <TableCell>{payment.timestamp}</TableCell>
              <TableCell numeric>{payment.amount}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    )
  }

  toggleBlockDetails=(blockAddr)=>{
    this.setState({blockDetails: this.state.blockDetails === blockAddr ? "" : blockAddr});
  }

  toggleTransDetails=(blockAddr)=>{
    this.setState({transDetails: this.state.transDetails === blockAddr ? "" : blockAddr});
  }

  render(){
    if(this.state.blocks === null || this.state.blocks.length === 0)
      return <div style={{textAlign:"center", color:"grey", marginTop:"40%"}}>There is no block in the blockchain system.</div>
    return (
      <Grid container spacing={8} justify="space-around">
        {
          (this.state.sortedBlockKeys).map((blockAddr)=>{
            return (
              <Grid item key={blockAddr+"_item"}>
                {this.genBlockCard(blockAddr, JSON.parse(this.state.blocks[blockAddr]))}
              </Grid>
            )
          })
        }
      </Grid>
    )
  }
}

class PublicLedger extends Component {
  constructor(props){
    super(props);
    this.handler = props.handler;
  }

  async componentDidMount(){
    if(await this.handler.fetchBlocks()){
      if(this.loader !== null){
        this.loader.dismiss(<Content ref={(content)=>this.content = content}/>, true);

        var sortedBlockKeys = Object.keys(this.handler.state.blocks).sort((a, b)=>{return b - a;})
        this.content.setSortedBlockKeys(sortedBlockKeys);
        this.content.setBlocks(this.handler.state.blocks);
        this.content.setAddressBook(this.handler.state.addressBook);
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
export default PublicLedger;
