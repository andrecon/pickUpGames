import React from 'react';
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { typography } from 'material-ui/styles';
import { string } from 'prop-types';

import Geocode from "react-geocode";

Geocode.setApiKey("YOUR_API_KEY");
Geocode.setLanguage("en");
Geocode.enableDebug();


var myLoc = new Array();

function codeAddress(callback,location) {
  var address = location;
  console.log("Boom", address)
  var geocoder = new google.maps.Geocoder();
  Geocode.fromAddress(address).then(
      response => {
        // const { lat, lng } = response.results[0].geometry.location;
        // var myLoc = new Array();
        
        myLoc["lat"] = response.results[0].geometry.location.lat;
        myLoc["lng"] = response.results[0].geometry.location.lng;
        console.log("DATA",location, myLoc)
        callback(myLoc);
      },
      error => {
        console.error(error);
      }
    );
    return myLoc;
}

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    var loc = codeAddress(function(num) {
      return num;
    }, this.props.address,loc);
    
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    }

    console.log("HERE1", this.props.latitude)
    console.log("HERE2", this.props.longitude)
    // binding this to event-handler functions
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
  }
  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }
  onMapClick = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  }
  render() {
    const style = {
      width: '41.5vw',
      height: '38vh',
      'marginLeft': 'none',
      'marginRight': 'none',
      'marginBottom': '200px'
    }
    return (
      <Map
        item
        xs = { 12 }
        style = { style }
        google = { this.props.google }
        onClick = { this.onMapClick }
        zoom = { 14 }
        initialCenter = {{ lat: this.props.latitude, lng: this.props.longitude }}
        // initialCenter = {{ lat: loc[0], lng: loc[1]}}
      >
        <Marker
          onClick = { this.onMarkerClick }
          title = { 'Changing Colors Garage' }
          initialCenter = {{ lat: this.props.latitude, lng: this.props.longitude }}
          // position = {{ lat: loc[0], lng: loc[1]}}
          name = { 'Changing Colors Garage' }
        />
        <InfoWindow
          marker = { this.state.activeMarker }
          visible = { this.state.showingInfoWindow }
        >
          <Paper>
            <Typography
              variant = 'headline'
              component = 'h4'
            >
              {this.props.title}
            </Typography>
            <Typography
              component = 'p'
            >
              {this.props.address} <br />
            </Typography>
          </Paper>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({  
    apiKey: 'YOUR_API_KEY',  
    v: "3.30"
})(MapContainer);
