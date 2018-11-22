import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import PaymentIcon from '@material-ui/icons/Payment';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';

class AppBottomBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      value : 1
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  componentWillMount(){

  }

  componentDidMount(){

  }

  componentWillUnMount(){

  }

  render(){
    return (
      <BottomNavigation
        style={{position:"fixed", width:"100%", bottom:"0px"}}
        value={this.state.value}
        onChange={this.handleChange}
      >
        <BottomNavigationAction label="Balance" icon={<AccountBalanceWalletIcon />} />
        <BottomNavigationAction label="Payment" icon={<PaymentIcon />} />
        <BottomNavigationAction label="Public Ledger" icon={<ChromeReaderModeIcon />} />
      </BottomNavigation>
    )
  }
}
export default AppBottomBar;
