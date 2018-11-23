import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

import AppTopBar from './AppTopBar';
import Frame from './Frame';
import AppBottomBar from './AppBottomBar';

import Login from './Login';

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

    }
    this.appbar = React.createRef();
  }

  componentWillMount(){

  }

  componentDidMount(){

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
