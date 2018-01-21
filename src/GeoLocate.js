import React from "react";

import Geolocation from "react-geolocation";

export default (props) => {

  return (
    <Geolocation
      onSuccess={props.magic}
      onError={props.noLocn}
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

// import {geolocated} from 'react-geolocated';

// class Demo extends React.Component {
//   render() {
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
// })(Demo)