import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

//Colors
import red from '@material-ui/core/colors/red';

class Loader extends Component {
  constructor(props){
    super(props);
    this.state = {
      showLoader: true,
      isLoggedIn: false,
      content: null
    }
  }

  componentWillMount(){

  }

  componentDidMount(){

  }

  componentWillUnMount(){

  }

  dismiss=(content, isLoggedIn)=>{
    this.setState({showLoader: false, content: content, isLoggedIn: isLoggedIn})
  }

  render(){
    if(this.state.showLoader){
      return(
        <div style={{textAlign:"center", marginTop:"10%"}}>
          <CircularProgress style={{color:red[500]}}/>
        </div>
      )
    } else if(this.state.isLoggedIn) return this.state.content;
    return (
      <div style={{textAlign:"center", marginTop:"10%"}}>
        <div style={{color:"grey"}}>Please login to the Wallet system first.</div>
        <Button style={{marginTop:"5%", color:red[500]}} variant="outlined" onClick={()=>window.location = "/Login"}>Login to Wallet System</Button>
      </div>
    )
  }
}
export default Loader;
