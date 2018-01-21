import React, { Component } from 'react'
import Demo from './GeoLocate'

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker } from "react-google-maps";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox"
import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel"
import _ from "lodash"
import { compose, withProps, lifecycle } from "recompose"


// https://developers.google.com/maps/documentation/javascript/reference#MapOptions

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
        center: this.props.currentPos,
        markers: [{ lat: -34.397, lng: 150.644 }, { lat: -34.327, lng: 150.644 }],
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
    componentWillReceiveProps(nextProps) {
      console.log('next', nextProps.hasCurrent)
      nextProps.hasCurrent || this.setState({center:nextProps.currentPos})
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    options={{disableDoubleClickZoom:true,  mapTypeControl: false, zoomControl: true, clickableIcons:false, streetViewControl: false, fullscreenControl: false}}
    onDblClick={props.onMapClick}
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
        placeholder="Search for a location"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `20px`,
          marginLeft: `20px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}

    {props.data.map((marker, index) =>
      <MarkerWithLabel
      key={index}
      position={marker}
      labelAnchor={new window.google.maps.Point(0, 0)}
      labelStyle={{backgroundColor: "yellow", fontSize: "32px", padding: "16px"}}
    >
      <div>Search Res</div>
    </MarkerWithLabel>
    )}
    

  </GoogleMap>
)

class App extends Component {
  state = {
    currentPos: {
         lat: -32.8688, lng: 151.19494699999998
        }, 
    places: [{ lat: -34.397, lng: 150.644 }, { lat: -34.327, lng: 150.644 }],
    addItm:false,
    hasCurrent:false
  }
  placeDiv = (x_pos, y_pos) => {
  var d = document.getElementById('yourDivId');
    d.style.position = "absolute";
    d.style.left = x_pos+'px';
    d.style.top = y_pos+'px';
  }
  onMapClick = e => {
    // console.log('mapclick', e)
    // console.log('TELL me the LONG/LAT', {lng: e.latLng.lng(), lat: e.latLng.lat()})
    this.placeDiv(e.pixel.x, e.pixel.y)
    this.setState({addItm:true})
  }
  cancelItm = e =>{
    this.setState({addItm:false})
  }
  magic = e =>{
    const { places } = this.state
    const newPos = {
      lat: e.coords.latitude,
      lng: e.coords.longitude
    }
    // console.log('the magic', e.coords, 'newval', newPos)
    this.setState({currentPos:newPos, places: [newPos, ...places]}, () => this.setState({hasCurrent:true}) )
  }
  noLocn = e =>{
    const { places } = this.state
    const ipLocn = { lat: -30.8688, lng: 151.19294699999998 }
   this.setState({currentPos:ipLocn, places: [ipLocn, ...places]}, () => this.setState({hasCurrent:true}) )
  }
  render() {
    const { addItm } = this.state
    const addBox = addItm ? {zIndex:'2', backgroundColor:'red', padding:'1em'} : {display: 'none'}
    return (
      <div>
      {addItm && <div onClick={this.cancelItm} style={{backgroundColor:'grey', zIndex:'1', position:'absolute', opacity:0.4, height:'100vh', width:'100vw'}}/>}
      <MapWithASearchBox onMapClick={e=>this.onMapClick(e)} data={this.state.places} currentPos={this.state.currentPos} hasCurrent={this.state.hasCurrent}/>
      <div style={addBox} id="yourDivId"> Add location <button onClick={this.cancelItm}> clic </button></div>
      <Demo magic={e=>this.magic(e)} noLocn={e=>this.noLocn(e)}/>
      </div>
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
