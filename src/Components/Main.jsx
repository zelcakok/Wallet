import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

import AppTopBar from './AppTopBar';
import Frame from './Frame';
import AppBottomBar from './AppBottomBar';

import Login from './Login';

import Authenticator from './Authenticator';
import API from './API';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Content extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
    this.handler = props.handler;
    this.frameLayout = React.createRef();
  }

  changeFragment=(fragmentID)=>{
    this.frameLayout.current.changeFragment(fragmentID);
  }

  render(){
    return (
      <div>
        <Frame ref={this.frameLayout} handler={this.handler}/>
        <AppBottomBar handler={this}/>
      </div>
    )
  }
}

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: false,
      profile: null,
      blocks: null,
      addressBook: null
    }
    this.appbar = React.createRef();
    this.auth = Authenticator.getInstance();
  }

  async fetchProfile(){
    if(this.state.profile) return this.state.profile;
    var cred = await this.auth.isLoggedIn();
    if(cred){
      this.setState({credential: cred, isLoggedIn: true});
      var response = await API.profile();
      this.setState({profile: response.data});
      return Promise.resolve(response.data);
    } else {
      return Promise.resolve(false);
    }
  }

  async fetchBlocks(){
    if(this.state.blocks) return this.state.blocks;
    var cred = await this.auth.isLoggedIn();
    if(cred){
      this.setState({credential: cred, isLoggedIn: true});
      var response = await API.blocks();
      this.setState({blocks: response.data.blocks, addressBook: response.data.addressBook});
      return Promise.resolve(response.data);
    } else {
      return Promise.resolve(false);
    }
  }

  componentWillMount(){

  }

  componentWillUnMount(){

  }

  render(){
    return (
      <Router>
        <div>
          <AppTopBar ref={this.appbar}/>
          <Route exact path="/" render={()=><Content handler={this}/>}/>
          <Route exact path="/Login" render={()=><Login/>}/>
        </div>
      </Router>
    )
  }
}
export default Main;
