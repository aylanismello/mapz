// import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';

/* global google */

import canUseDOM from "can-use-dom";

import raf from "raf";

import {
  default as React,
  Component,
} from "react";

import {
  withGoogleMap,
  GoogleMap,
  Circle,
  InfoWindow,
} from "react-google-maps";

const geolocation = (
  canUseDOM && navigator.geolocation ?
  navigator.geolocation :
  ({
    getCurrentPosition(success, failure) {
      failure(`Your browser doesn't support geolocation.`);
    },
  })
);

const geolocationText = 'Your Current Location';

const GeolocationExampleGoogleMap = withGoogleMap(props => (
  <div className="google-map">
    <GoogleMap
      defaultZoom={4}
      center={props.center}
      googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.27&libraries=places,geometry&key=AIzaSyAuj6mEHmxKKIh96-EdzReWpjfjPG3Fje0"
    >
      {props.center && (
        <InfoWindow position={props.center}>
          <div>{props.content}</div>
        </InfoWindow>
      )}
      {props.center && (
        <Circle
          center={props.center}
          radius={props.radius}
          options={{
            fillColor: `red`,
            fillOpacity: 0.20,
            strokeColor: `red`,
            strokeOpacity: 1,
            strokeWeight: 1,
          }}
        />
      )}
    </GoogleMap>
  </div>
));

/*
 * https://developers.google.com/maps/documentation/javascript/examples/map-geolocation
 *
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
export default class GeolocationExample extends Component {

  state = {
    center: null,
    content: null,
    radius: 6000,
  };

  isUnmounted = false;

  componentDidMount() {
    const tick = () => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({ radius: Math.max(this.state.radius - 20, 0) });

      if (this.state.radius > 200) {
        raf(tick);
      }
    };
    geolocation.getCurrentPosition((position) => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        content: geolocationText,
      });

      raf(tick);
    }, (reason) => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        center: {
          lat: 34.052235,
          lng: -118.243683,
        },
        content: `Geolocation service failed, welcome to Los Angeles.`,
      });
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    return (
      <div className="google-maps-container">
        <GeolocationExampleGoogleMap
          containerElement={
            <div style={{ height: `100%` }} />
          }
          mapElement={
            <div style={{ height: `100%` }} />
          }
          center={this.state.center}
          content={this.state.content}
          radius={this.state.radius}
        />
      </div>
    );
  }
}
