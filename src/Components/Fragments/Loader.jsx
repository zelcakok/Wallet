import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

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
        <div style={{textAlign:"center", marginTop:"40%"}}>
          <CircularProgress style={{color:red[500]}}/>
        </div>
      )
    } else if(this.state.isLoggedIn) return this.state.content;
    return (
      <div style={{textAlign:"center", marginTop:"40%"}}>
        <div>Please login first</div>
      </div>
    )
  }
}
export default Loader;
