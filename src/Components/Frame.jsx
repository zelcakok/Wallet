import React, { Component } from 'react';

import Payment from './Fragments/Payment';
import Balance from './Fragments/Balance';
import PublicLedger from './Fragments/PublicLedger';

const FRAGMENT_PAYMENT = 1;
const FRAGMENT_BALANCE = 0;
const FRAGMENT_PUBLICLEDGER = 2;

const RATIO = 0.81;

class Frame extends Component {
  constructor(props){
    super(props);
    this.state = {
      fragmentID: FRAGMENT_PAYMENT,
      height: window.innerHeight * RATIO
    }
    this.handler = props.handler;
  }

  resize=()=>{
    this.setState({height: window.innerHeight * RATIO});
  }

  componentWillMount(){

  }

  componentDidMount(){
    window.addEventListener('resize', this.resize);
  }

  componentWillUnMount(){
    window.removeEventListener('resize', this.resize);
  }

  changeFragment(fragmentID){
    this.setState({fragmentID: fragmentID});
  }

  getFragmentID=()=>{
    return this.state.fragmentID;
  }

  render(){
    return (
      <div style={{padding:"1.5%", minHeight:this.state.height}} id="container">
        {
          this.state.fragmentID === FRAGMENT_PAYMENT ? <Payment/> :
          this.state.fragmentID === FRAGMENT_BALANCE ? <Balance/> : <PublicLedger/>
        }
      </div>
    )
  }
}
export default Frame;
