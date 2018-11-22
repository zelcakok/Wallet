import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import AppTopBar from './Components/AppTopBar';
import Main from './Components/Main';

class App extends Component {
  render() {
    return (
      <div>
        <Main/>
      </div>
    );
  }
}

export default App;
