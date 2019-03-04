/* global window */
import React, { Component } from 'react';
import MapGL, { Marker, FlyToInterpolator } from 'react-map-gl';
import './MapView.css';

import * as d3 from 'd3';

import './mapview-style.css';

import csv from '../new_data.csv';
import BUILDING_COORDINATES from './buildings.json';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicDkxNjQ4NyIsImEiOiJjanNxNXpndHIwMndhNDlzOWF5Y2R3NGtsIn0.s4Q-rIxXSgTx4N_OLfBkDg'; // Set your mapbox token here


const back_button = (
  <svg width="10px" height="16px" viewBox="0 0 10 16">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Details" transform="translate(-275.000000, -70.000000)" fill="#FFFFFF" fillRule="nonzero">
              <g id="Map">
                  <g id="Top-3" transform="translate(260.000000, 0.000000)">
                      <g id="button" transform="translate(0.000000, 58.000000)">
                          <path d="M23.8228571,26.063619 L17.7565714,19.9977143 L23.744381,14.0099048 C23.9881905,13.8 24.1428571,13.4895238 24.1428571,13.1428571 C24.1428571,12.511619 23.6312381,12 23,12 C22.6925714,12 22.4148571,12.1211429 22.2095238,12.3180952 L22.2064762,12.3150476 L15.3493333,19.1721905 L15.3497143,19.1725714 C15.1340952,19.3805714 15,19.672 15,19.9950476 C15,19.9958095 15,19.9965714 15,19.9977143 C15,19.9984762 15,19.9992381 15,20.000381 C15,20.3238095 15.1340952,20.6148571 15.3497143,20.8228571 L15.3493333,20.8232381 L22.2064762,27.680381 L22.2068571,27.68 C22.4125714,27.8780952 22.6918095,28 23,28 C23.6312381,28 24.1428571,27.488381 24.1428571,26.8571429 C24.1428571,26.5489524 24.0209524,26.2697143 23.8228571,26.063619 L23.8228571,26.063619 Z" id="Path"></path>
                      </g>
                  </g>
              </g>
          </g>
      </g>
  </svg>
)

export default class App extends Component {
  constructor(props) {
    super(props)

    this. state = {
      buildings: [],
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
        scrollZoom: false,
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
    this.$marker = {}
  }

  _inBounds = (point, bounds) => {
    let lng = (point[0] - bounds._ne.lng) * (point[0] - bounds._sw.lng) < 0;
    let lat = (point[1] - bounds._ne.lat) * (point[1] - bounds._sw.lat) < 0;
    return lng && lat;
  }

  componentDidMount() {
    const { onLoad } = this.props

    d3.csv(csv).then(function(data) {
      const buildings = d3.nest()
        .key(d => d.building_id)
        .rollup(v => ({
          id: v[0].building_id,
          address: v[0].building_address,
          volume: Math.round(d3.sum(v, d => d.volume))
        }))
        .entries(data).sort((a,b) => (b.value.volume - a.value.volume))


      const buildings2 = d3.nest()
        .key(d => d.building_id)
        .key(d => d.apartment_id)
        .rollup(v => ({
          building_id : v[0].building_id,
          id : v[0].apartment_id,
          size : v[0].apartment_size,
          name : v[0].apartment_name,
          number : v[0].apartment_number,
          volume: Math.round(d3.sum(v, d => d.volume))
        }))
        .entries(data)


      let apartmentDict = {}
      buildings2.map(apartment => (apartmentDict[apartment.key] = apartment.values))

      const totalVolume = buildings.reduce((acc, current) => (acc + current.value.volume), 0);
      const avgVolume = buildings ? totalVolume / buildings.length : 0;


      this.setState({ buildings : buildings, apartments : apartmentDict, averageVolume : avgVolume }, onLoad)
    }.bind(this))
  }


  _onMapLoad = e => this.setState({ map : this.$map.getMap(), bounds : this.$map.getMap().getBounds() })

  _onViewportChange = viewport => this.setState({ viewport: { ...this.state.viewport, ...viewport } }, this._updateBounds)

  _onBackClick = (i, longitude, latitude ) => {
    const { setSelectedBuilding } = this.props;

    setSelectedBuilding(null)

    this.setState({ 
      selectedBuilding : null,
      viewport: {
        ...this.state.viewport,
        zoom: 15.9,
      },
      settings: {
        dragPan: true,
        dragRotate: true,
        scrollZoom: false,
        touchZoom: true,
        touchRotate: true,
        keyboard: true,
        doubleClickZoom: true,
      }
    })
  }

  setMarkerActive(id, value) {
    d3.select(this.$marker[id]).attr("data-selected", value);
  }

  _goToBuilding = (building, longitude, latitude ) => {
    const { setSelectedBuilding } = this.props;

    setSelectedBuilding(building.id)

    this.setState({ 
      selectedBuilding : building,
      viewport: {
        ...this.state.viewport,
        longitude,
        latitude,
        zoom: 17,
      },
      settings: {
        dragPan: false,
        dragRotate: false,
        scrollZoom: false,
        touchZoom: false,
        touchRotate: false,
        keyboard: false,
        doubleClickZoom: false,
      }
    })
  }

  _updateBounds = () => {
    if (this.state.map) {
      this.setState({ bounds : this.state.map.getBounds() })
    }
  }

  _renderMarker = (zoom, selectedBuilding, building, averageVolume, i) => {
    const { id, address, volume } = building;
    const [ long, lat ] = BUILDING_COORDINATES[id].coordinates;

    let markerScale = d3.scaleLinear()
      .domain([18, 15.9])
      .range([3, 1])

    const scale = Math.max(Math.min(markerScale(zoom), 3), 1)
    const selected = (selectedBuilding && (building.address == selectedBuilding.address))

    const percentage = Math.round((volume / averageVolume - 1) * 100);
    const percentageString = (percentage > 0) ? `+${ percentage }` : `${ percentage }`;

    return (
      <Marker key={ id } data-selected={ selected } longitude={ long } latitude={ lat }
        captureDrag={ false } captureDoubleClick={ false }>
        <div ref={ element => this.$marker[id] = element } className="building" data-selected={ selected } onClick= { () => this._goToBuilding(building, long, lat) }>
          <div className="pin" style={{ transform: `scale(${ scale })` }}>
          </div>

          <div className="pop-up">
            <div className="pop-up-info">
              <h4 className="adress-heading">{ address }</h4>
            </div>

            <div className="pop-up-stats">
              <h5 className="info-heading">This month</h5>

              <div className="consumption-stats">
                <h4 className="consumption-heading">{ volume.toLocaleString() } Liters</h4>
                <h4 className="percentage-heading" data-positive={ !!(percentage >= 0) }>{ percentageString } %</h4>
              </div>
            </div>
          </div>
        </div>
      </Marker>
    )
  }

  _renderHeaderBuildingItem = (building, i) => {
    const { id, address, volume } = building;

    return (
      <li key={ id } className="header-list-item">
        <h3>{ address}</h3>

        <div className="list-item-stats">
          <h4 className="consumption-heading">{ volume.toLocaleString() } <span className="unit">Liters</span></h4>
        </div>
      </li>
    )
  }

  _renderHeaderApartmentItem = (building, i) => {
    const { id, number, volume } = building;

    return (
      <li key={ id } className="header-list-item">
        <h3>Apartment { number}</h3>

        <div className="list-item-stats">
          <h4 className="consumption-heading">{ volume.toLocaleString() } <span className="unit">Liters</span></h4>
        </div>
      </li>
    )
  }

  _renderBuilding = (building, apartments) => {
    const { id, address, volume } = building;
    const [ long, lat ] = BUILDING_COORDINATES[id].coordinates;

    return (
      <li key={ id } className="detailed-list-item building-list-item" onClick= { () => this._goToBuilding(building, long, lat) } onMouseEnter= { () => this.setMarkerActive(id, "true") } onMouseLeave= { () => this.setMarkerActive(id, null) }>
        <h3>{ address }</h3>
        <h4>{ apartments.length } apartments</h4>
      </li>
    )
  }

  _renderApartment = (apartment, i) => {
    const { id, number, size } = apartment;
    const { selectedApartment, setSelectedApartment } = this.props;

    return (
      <li key={ id } className="detailed-list-item apartment-list-item" data-selected={ (selectedApartment && (selectedApartment == id)) }  data-room-size={ size } onClick= { () => setSelectedApartment(apartment.id, apartment.number) }>
        <h3>{ number }</h3>
      </li>
    )
  }

  render() {
    const { map, bounds, selectedBuilding, buildings, apartments, averageVolume, viewport, settings } = this.state;
    const { zoom } = viewport;


    let visibleBuildings = []
    if (bounds) {
      visibleBuildings = buildings.filter(building => this._inBounds(BUILDING_COORDINATES[building.key].coordinates, bounds));
    }



    /* Skräääääp */
    let topheader = "Top consumers"
    let topList = visibleBuildings.map((building, i) => this._renderHeaderBuildingItem(building.value, i));

    let bottomHeader = `${ visibleBuildings.length } Buildings`
    let bottomLegend = null;
    const buildingList = visibleBuildings.map((building, i) => this._renderBuilding(building.value, apartments[building.key], averageVolume, i));
    let bottomList = <ul className="map-detailed-list building-list">{ buildingList }</ul>

    if (selectedBuilding) {
      const apartmentBuildings = apartments[selectedBuilding.id];

      topheader = selectedBuilding.address
      topList = apartmentBuildings
        .sort((a, b) => (b.value.volume - a.value.volume))
        .slice(0, Math.min(apartmentBuildings.length, 3))
        .map((apartment, i) => this._renderHeaderApartmentItem(apartment.value, i))

      bottomHeader = `${ apartmentBuildings.length } Apartments`
      bottomLegend = (
        <div className="legend-list-container">
          <h4>Rooms</h4>

          <ul className="legend-list">
            <li className="legend-list-item" data-room-size="1">
              <figure></figure>

              <h5>1</h5>
            </li>

            <li className="legend-list-item" data-room-size="2">
              <figure></figure>

              <h5>2</h5>
            </li>

            <li className="legend-list-item" data-room-size="3">
              <figure></figure>

              <h5>3</h5>
            </li>

            <li className="legend-list-item" data-room-size="4">
              <figure></figure>

              <h5>4</h5>
            </li>
          </ul>
        </div>
      )
      const apartmentList = apartmentBuildings
        .sort((a, b) => (a.value.number - b.value.number))
        .map((apartment, i) => this._renderApartment(apartment.value, i));
      bottomList = <ul className="map-detailed-list apartment-list">{ apartmentList }</ul>
    }


    const makers = visibleBuildings.map((building, i) => this._renderMarker(zoom, selectedBuilding, building.value, averageVolume, i));


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

        <div className="container content-columns">
          <div className="column top map-header">
            <div className="map-header-info">
              <button className="back-button" onClick={ this._onBackClick }>{ back_button }</button>

              <h2>{ topheader }</h2>
              <h4>This Month</h4>
            </div>

            <ul className="map-header-list">{ topList }</ul>
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
              <h2>{ bottomHeader }</h2>

              { bottomLegend }
            </div>

            { bottomList }
          </div>
        </div>
      </div>
    );
  }

}