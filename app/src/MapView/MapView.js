/* global window */
import React, { Component } from 'react';
import MapGL, { Marker, FlyToInterpolator } from 'react-map-gl';

import * as d3 from 'd3';

import './mapview-style.css';

import buildings from './buildings.json';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicDkxNjQ4NyIsImEiOiJjanNxNXpndHIwMndhNDlzOWF5Y2R3NGtsIn0.s4Q-rIxXSgTx4N_OLfBkDg'; // Set your mapbox token here

export default class App extends Component {
  constructor(props) {
    super(props)

    this. state = {
      map: null,
      selectedBuilding: null,
      viewport: {
        latitude: 59.35098948744254,
        longitude: 18.062560628353477,
        zoom: 15.9,
      },
      settings: {
        dragPan: true,
        dragRotate: true,
        scrollZoom: true,
        touchZoom: true,
        touchRotate: true,
        keyboard: true,
        doubleClickZoom: true,
        minZoom: 0,
        maxZoom: 20,
        minPitch: 0,
        maxPitch: 85
      }
    }

    this.$map = null;
  }

  _inBounds = (point, bounds) => {
    let lng = (point[0] - bounds._ne.lng) * (point[0] - bounds._sw.lng) < 0;
    let lat = (point[1] - bounds._ne.lat) * (point[1] - bounds._sw.lat) < 0;
    return lng && lat;
  }


  _onMapLoad = e => this.setState({ map : this.$map.getMap(), bounds : this.$map.getMap().getBounds() })

  _onViewportChange = viewport => this.setState({ viewport: { ...this.state.viewport, ...viewport } }, this._updateBounds)

  _onBackClick = (i, longitude, latitude ) => this.setState({ 
    selectedBuilding : null,
    viewport: {
      ...this.state.viewport,
      zoom: 15.9,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic,
      transitionDuration: 1000,
      onTransitionEnd: this._updateBounds
    }
  })

  _goToBuilding = (i, longitude, latitude ) => this.setState({ 
    selectedBuilding : i,
    viewport: {
      ...this.state.viewport,
      longitude,
      latitude,
      zoom: 17,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic,
      transitionDuration: 1000,
      onTransitionEnd: this._updateBounds
    }
  })

  _updateBounds = () => {
    if (this.state.map) {
      this.setState({ bounds : this.state.map.getBounds() })
    }
  }

  _renderMarker = (zoom, selectedBuilding, building, i) => {
    const { name, coordinates } = building;
    const [ long, lat ] = coordinates;

    let markerScale = d3.scaleLinear()
      .domain([18, 15.9])
      .range([3, 1])


    const scale = Math.max(Math.min(markerScale(zoom), 3), 1)
    const selected = (selectedBuilding && (building.name == selectedBuilding.name))

    return (
      <Marker key={ building.name } data-selected={ selected } longitude={ long } latitude={ lat }
        captureDrag={ false } captureDoubleClick={ false }>
        <div className="building" data-selected={ selected } onClick= { () => this._goToBuilding(building, long, lat) }>
          <div className="pin" style={{ transform: `scale(${ scale })` }}>
          </div>

          <div className="pop-up">
            <div className="pop-up-info">
              <h4 className="adress-heading">{ name }</h4>
            </div>

            <div className="pop-up-stats">
              <h5 className="info-heading">This month</h5>

              <div className="consumption-stats">
                <h4 className="consumption-heading">230 348 Litres</h4>
                <h4 className="percentage-heading" data-positive={ 1 }>+22%</h4>
              </div>
            </div>
          </div>
        </div>
      </Marker>
    )
  }

  _renderBuilding = (building, i) => {
    const { name, coordinates } = building;
    const [ long, lat ] = coordinates;

    return (
      <li key={ building.name } className="detailed-list-item" onClick= { () => this._goToBuilding(building, long, lat) }>
        <h3>{ name }</h3>
        <h4>24 buildings</h4>
      </li>
    )
  }

  render() {
    const { map, bounds, selectedBuilding, viewport, settings } = this.state;
    const { zoom } = viewport;


    let header = "Top consumers"
    if (selectedBuilding) {
      header = selectedBuilding.name
    }


    let visibleBuildings = []
    if (bounds) {
      visibleBuildings = buildings.filter(building => this._inBounds(building.coordinates, bounds));
    }

    const makers = visibleBuildings.map((building, i) => this._renderMarker(zoom, selectedBuilding, building, i));
    const buildingList = visibleBuildings.map(this._renderBuilding);

    return (
      <div id="map-view" data-apartment-selected={ !!selectedBuilding }>
        <div className="map-bg">
          <MapGL
            { ...viewport }
            { ...settings }
            reuseMap={ true }
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/light-v9"
            onViewportChange={ this._onViewportChange }
            mapboxApiAccessToken={ MAPBOX_TOKEN } >
          </MapGL>
        </div>

        <div className="content-container content-columns">
          <div className="column top map-header">
            <div className="map-header-info">
              <button className="back-button" onClick={ this._onBackClick }>Back</button>

              <h2>{ header }</h2>
              <h4>This Month</h4>
            </div>

            <ul className="map-header-list">
              <li className="header-list-item">
                <h3>Linstedsvägen 24</h3>

                <div className="list-item-stats">
                  <h4 className="consumption-heading">194 438 <span className="unit">L</span></h4>
                  <h3 className="percentage-heading" data-positive={ 1 }>- 24%</h3>
                </div>
              </li>
              
              <li className="header-list-item">
                <h3>Linstedsvägen 24</h3>

                <div className="list-item-stats">
                  <h4 className="consumption-heading">194 438 <span className="unit">L</span></h4>
                  <h3 className="percentage-heading" data-positive={ 1 }>- 24%</h3>
                </div>
              </li>

              <li className="header-list-item">
                <h3>Linstedsvägen 24</h3>

                <div className="list-item-stats">
                  <h4 className="consumption-heading">194 438 <span className="unit">L</span></h4>
                  <h3 className="percentage-heading" data-positive={ 1 }>- 24%</h3>
                </div>
              </li>
            </ul>
          </div>

          <div className="column middle map-clickable">
            <MapGL
              {...viewport}
              {...settings}
              ref={ element => this.$map = element }
              reuseMap={ true }
              width="100%"
              height="100%"
              mapStyle="mapbox://styles/mapbox/light-v9"
              mapboxApiAccessToken={ MAPBOX_TOKEN }
              onLoad={ this._onMapLoad.bind(this) }>
              { makers }
            </MapGL>
          </div>

          <div className="column bottom map-detailed">
            <div className="map-detailed-info">
              <h2>{ visibleBuildings.length } Buildings</h2>
              <h4>out of { buildings.length } available</h4>
            </div>

            <ul className="map-detailed-list">{ buildingList }</ul>
          </div>
        </div>
      </div>
    );
  }

}