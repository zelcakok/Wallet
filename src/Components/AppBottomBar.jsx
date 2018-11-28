//ReactJS
import React, { Component } from 'react';

//Material UI
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import PaymentIcon from '@material-ui/icons/Payment';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import MinersIcon from '@material-ui/icons/Adb';
import Divider from '@material-ui/core/Divider';
import red from '@material-ui/core/colors/red';

class AppBottomBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedTab : 0,
      isLoggedIn: false,
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
    this.handler.handler.setUpdateUnSeen(this.updateUnSeen);
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
          <BottomNavigationAction style={{color: this.state.selectedTab===0?red[500]:''}} label="Balance" icon={<AccountBalanceWalletIcon/>}/>
          <BottomNavigationAction style={{color: this.state.selectedTab===1?red[500]:''}} label="Payment" icon={<PaymentIcon/>}/>
          <BottomNavigationAction style={{color: this.state.selectedTab===2?red[500]:''}} label="Public Ledger" icon={<ChromeReaderModeIcon />} />
          <BottomNavigationAction style={{color: this.state.selectedTab===3?red[500]:''}} label="Miners" icon={<MinersIcon />} />
        </BottomNavigation>
      </div>
    )
  }
}
export default AppBottomBar;
