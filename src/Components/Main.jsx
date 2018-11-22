import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

import AppTopBar from './AppTopBar';
import Frame from './Frame';
import AppBottomBar from './AppBottomBar';

import Auth from '../../../blockchain/OAuth/Auth';

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }

  componentWillMount(){

  }

  componentDidMount(){

  }

  componentWillUnMount(){

  }

  render(){
    return (
      <div>
        <AppTopBar/>
        <Frame/>
        <AppBottomBar/>
      </div>
    )
  }
}
export default Main;
