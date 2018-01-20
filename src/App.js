import React, { Component } from 'react';
import {Map } from 'google-maps-react'

class App extends Component {
  onMapClick = e => {
    console.log('Current location!', e)
  }
  render() {
    return (
      <div className="App">
      <br/><br/><br/><br/>
        <Map onClick={this.onMapClick} google={window.google} />
      </div>
    );
  }
}

export default App;
