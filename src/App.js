import React, { Component } from 'react';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const MapWithAMarker = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    onClick={props.onMapClick}
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >

      {props.data.map(marker => (
        <Marker
          key={marker.lat}
          position={{ lat: marker.lat, lng: marker.lng }}
        />
      ))}
  </GoogleMap>
));


class App extends Component {
  state = {
    places: [{ lat: -34.397, lng: 150.644 }, { lat: -34.327, lng: 150.644 }]
  }
  onMapClick = e => {
    console.log('TELL me the LONG/LAT', e)
    const { places } = this.state
    // this.setState({places:[e.ea, ...places]})
  }
  render() {
    return (
      <div className="App">
      <br/><br/><br/><br/>
      <MapWithAMarker
  onMapClick={e=>this.onMapClick(e)}
  getPosition={e=>this.onMapClick(e)}
  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAJIsQq2P13hvXC12s7bdzvyb9btODQQNU&v=3.exp&libraries=geometry,drawing,places"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `400px` }} />}
  mapElement={<div style={{ height: `100%` }} />}
  data={this.state.places}
/>
      </div>
    );
  }
}

export default App;
