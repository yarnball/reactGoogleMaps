import React, { Component } from 'react';

import {
  withScriptjs,
  // InfoWindow,
  withGoogleMap,
  GoogleMap,
  Marker } from "react-google-maps";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox"
import _ from "lodash"
import { compose, withProps, lifecycle } from "recompose"

const MapWithASearchBox = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAJIsQq2P13hvXC12s7bdzvyb9btODQQNU&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        bounds: null,
        center: {
          lat: 41.9, lng: -87.624
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new window.google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    onRightClick={props.onMapClick}
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
    
      <input
        type="text"
        placeholder="Customized your placeholder"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {props.data.map((marker, index) =>
      <Marker key={index} position={marker} onClick={props.onToggleOpen}/>
    )}
  </GoogleMap>
)

class App extends Component {
  state = {
    places: [{ lat: -34.397, lng: 150.644 }, { lat: -34.327, lng: 150.644 }]
  }
  onMapClick = e => {
    console.log('TELL me the LONG/LAT', {lng: e.latLng.lng(), lat: e.latLng.lat()})
    const { places } = this.state
    this.setState({places:[ {lng: e.latLng.lng(), lat: e.latLng.lat()} , ...places]})
  }
  render() {
    return (
      <MapWithASearchBox onMapClick={e=>this.onMapClick(e)} data={this.state.places}/>
    );
  }
}

// const MapWithAMarker = withScriptjs(withGoogleMap(props =>
//   <GoogleMap
//     onDblClick={props.onMapClick}
//     defaultZoom={8}
//     defaultCenter={{ lat: -34.397, lng: 150.644 }}
//   >

//       {props.data.map(marker => (
//         <Marker
//           key={marker.lat}
//           position={{ lat: marker.lat, lng: marker.lng }}
//         />
//       ))}
//   </GoogleMap>
// ));


// class App extends Component {
//   state = {
//     places: [{ lat: -34.397, lng: 150.644 }, { lat: -34.327, lng: 150.644 }]
//   }
//   onMapClick = e => {
//     console.log('TELL me the LONG/LAT', JSON.parse(JSON.stringify(e.latLng)))
//     const { places } = this.state
//     this.setState({places:[JSON.parse(JSON.stringify(e.latLng)), ...places]})
//   }
//   render() {
//     return (
//       <div className="App">
//       <br/><br/><br/><br/>
//       <MapWithAMarker
//   onMapClick={e=>this.onMapClick(e)}
//   getPosition={e=>this.onMapClick(e)}
//   googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAJIsQq2P13hvXC12s7bdzvyb9btODQQNU&v=3.exp&libraries=geometry,drawing,places"
//   loadingElement={<div style={{ height: `100%` }} />}
//   containerElement={<div style={{ height: `400px` }} />}
//   mapElement={<div style={{ height: `100%` }} />}
//   data={this.state.places}
// />
//       </div>
//     );
//   }
// }

export default App;
