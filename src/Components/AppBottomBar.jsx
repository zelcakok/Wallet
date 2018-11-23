import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import PaymentIcon from '@material-ui/icons/Payment';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';

import Divider from '@material-ui/core/Divider';
import Frame from './Frame';


//Colors
import red from '@material-ui/core/colors/red';

class AppBottomBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedTab : 0,
      isLoggedIn: false
    }
    this.handler = props.handler;
  }

  handleChange = (event, value) => {
    this.setState({ selectedTab : value});
    this.handler.changeFragment(value);
  };

  componentWillMount(){

  }

  componentDidMount(){
    this.setState({selectedTab: this.handler.frameLayout.current.getFragmentID()})
  }

  componentWillUnMount(){

  }

  render(){
    return (
      <div>
        <Divider/>
        <BottomNavigation
          value={this.state.selectedTab}
          onChange={this.handleChange}
          showLabels
        >
          <BottomNavigationAction style={{color: this.state.selectedTab===0?red[500]:''}} label="Balance" icon={<AccountBalanceWalletIcon />}/>
          <BottomNavigationAction style={{color: this.state.selectedTab===1?red[500]:''}} label="Payment" icon={<PaymentIcon />} />
          <BottomNavigationAction style={{color: this.state.selectedTab===2?red[500]:''}} label="Public Ledger" icon={<ChromeReaderModeIcon />} />
        </BottomNavigation>
      </div>
    )
  }
}
export default AppBottomBar;
