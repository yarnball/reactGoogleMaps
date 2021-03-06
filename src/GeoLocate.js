// import React from 'react';
// import {geolocated} from 'react-geolocated';

// class Demo extends React.Component {
//   state = { currentLocn: ''}

//   render() {
//     // this.props.gotLocn(this.props)
//     this.props.coords !== null && console.log('Run this function ONCE', this.props.coords)
//     return !this.props.isGeolocationAvailable
//       ? <div>Your browser does not support Geolocation</div>
//       : !this.props.isGeolocationEnabled
//         ? <div>Geolocation is not enabled</div>
//         : this.props.coords
//           ? <table>
//             <tbody>
//               <tr><td>latitude</td><td>{this.props.coords.latitude}</td></tr>
//               <tr><td>longitude</td><td>{this.props.coords.longitude}</td></tr>
//               <tr><td>altitude</td><td>{this.props.coords.altitude}</td></tr>
//               <tr><td>heading</td><td>{this.props.coords.heading}</td></tr>
//               <tr><td>speed</td><td>{this.props.coords.speed}</td></tr>
//             </tbody>
//           </table>
//           : <div>Getting the location data&hellip; </div>;
//   }
// }

// export default geolocated({
//   positionOptions: {
//     enableHighAccuracy: false,
//   },
//   userDecisionTimeout: 5000,
// })(Demo);

import React from "react";

import Geolocation from "react-geolocation";

export default (props) => {

  return (
    <Geolocation
      onSuccess={props.gotLocn}
      onError={props.noLocn}
      fetchingPosition={props.fetchingPos}
      render={({
        fetchingPosition,
        position: { coords: { latitude, longitude } = {} } = {},
        error,
        getCurrentPosition
      }) =>
        <div>
        {JSON.stringify(error)}
          <button onClick={getCurrentPosition}>Get Position</button>
          {error &&
            <div>
              {error.message}
            </div>}
          <pre>
            latitude: {latitude} 
            longitude: {longitude}
          </pre>
        </div>}
    />
  );
};
