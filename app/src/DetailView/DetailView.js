import React, {Component} from 'react';
import LineChart from '../Charts/LineChart';
import BubbleChart from '../Charts/BubbleChart';
import GraphChart from '../Charts/GraphChart';
import LineChartWarmColdWater from '../Charts/LineChartWarmColdWater';
import PieChart from "../PieChart/PieChart";
import csv from '../new_data.csv';

import './detail-view.css';

//D3 v5
import * as d3 from "d3";

const arrow_right = (
  <svg className="arrow-right" viewBox="0 0 44 24" version="1.1">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g fill="#2D3755" fillRule="nonzero">
              <path d="M3,15 L33.182,15 L28.994,18.77 L29,18.779 C28.391,19.328 28,20.115 28,21.001 C28,22.658 29.343,24.001 31,24.001 C31.771,24.001 32.468,23.702 33,23.223 L33.007,23.231 L43.007,14.231 L43,14.222 C43.609,13.673 44,12.885 44,12 C44,11.115 43.609,10.327 43,9.778 L43.007,9.77 L33.007,0.77 L33,0.778 C32.468,0.3 31.771,0 31,0 C29.343,0 28,1.343 28,3 C28,3.885 28.391,4.673 29,5.222 L28.993,5.23 L33.182,9 L3,9 C1.343,9 4.88498131e-15,10.343 4.88498131e-15,12 C4.88498131e-15,13.657 1.343,15 3,15 Z"></path>
          </g>
      </g>
  </svg>
)

const close_icon = (
  <svg viewBox="0 0 34 34">
      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Details" transform="translate(-1149.000000, -498.000000)" fill="#000000" fillRule="nonzero">
              <g id="Content">
                  <g id="Header" transform="translate(0.000000, 436.000000)">
                      <g id="filter" transform="translate(1144.000000, 0.000000)">
                          <g id="header">
                              <g transform="translate(5.000000, 16.000000)" id="button">
                                  <g>
                                      <g id="close" transform="translate(0.000000, 46.000000)">
                                          <path d="M21.243,17 L33.122,5.121 C33.664,4.579 34,3.828 34,3 C34,1.343 32.657,0 31,0 C30.172,0 29.422,0.336 28.879,0.879 L17,12.757 L5.121,0.879 C4.578,0.336 3.828,0 3,0 C1.343,0 0,1.343 0,3 C0,3.828 0.336,4.578 0.879,5.121 L12.757,17 L0.879,28.879 C0.336,29.422 0,30.172 0,31 C0,32.657 1.343,34 3,34 C3.828,34 4.578,33.664 5.121,33.121 L17,21.243 L28.879,33.122 C29.422,33.664 30.172,34 31,34 C32.657,34 34,32.657 34,31 C34,30.172 33.664,29.422 33.121,28.879 L21.243,17 Z" id="Path"></path>
                                      </g>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
          </g>
      </g>
  </svg>
)

class DetailView extends Component {
  constructor() {
    super();

    this.state = {
      startDate: "2019-01-19",
      stopDate: "2019-01-25",
      timeOption: "month",
      buildingInfo: null,
      allDatesData: null,
      dataValidDates: null,
      apartmentid: null,
    };
  }

  componentDidMount = () => {
    this.readData();
  }

  //Waiting for new props from parent component
  componentDidUpdate = (prevProps) => {
    if (this.props.buildingid && (this.props.buildingid !== prevProps.buildingid)) {
        this.readData();
   }
  }

  updateDates = e => {
    var newDate = e.target.value;

    if (e.target.id == "start") {
      this.setState({ startDate: newDate }, this.updateValidData );
    } else if (e.target.id == "stop") {
      this.setState({ stopDate: newDate}, this.updateValidData);
    }
  }

  updateValidData = () => {
    var newValidDates= this.state.allDatesData.filter(d => d.key >= this.state.startDate && d.key <= this.state.stopDate);

    this.setState({ dataValidDates: newValidDates });
  }

  readData = () => {
    var _this = this;

    // 1- Alla byggnader ---
    //   1- Gruppera på datum (summera vattenkonsumtion)
    //   2- och en som aggregerar på hour (summera vattenkonsumtion)
    //   3- Till bubbleChart - aggregerad på byggnad och apartment


    // 2- En vald byggnad ---
    //   1- Gruppera på datum och filtra ut byggnad
    d3.csv(csv).then(function(data) {
      //Nest for building info
      var buildings = d3.nest()
        .key(function(d) { return d.building_id })
        .rollup(function(v) {
          return {
            building_id: v[1].building_id,
            no_apartments: d3.set(v,function(d) { return d.apartment_id }).size(),
            apartments_id: d3.set(v,function(d) { return d.apartment_id }),
            volume: d3.sum(v,function(d) { return d.volume; }),
            hot: d3.sum(v,function(d) { return d.hot; }),
            cold: d3.sum(v,function(d) { return d.cold; }),
            apartment_number : v[0].apartment_number,
            //data: v
          };
        })
        .entries(data)
        .filter(function(d){
          return d.key!=""&&d.key!="undefined";
        });

      //Fulter on tha buildingid in props
      //console.log("buildings: "+buildings.data)
      var buildingSelected=buildings.find(d => d.key ===_this.props.buildingid).value;

      _this.setState({buildingInfo: buildingSelected})
      console.log("AFTER");
      console.log(buildingSelected)
      //buildingSelected.map(function(d){console.log(d)})



      //Dates naset for linechart
      var apartments_dates = d3.nest()
        .key(function(d) { return d.building_id; })
        .key(function(d) { return d.apartment_id; })
        .key(function(d) { return d.timestamp_hour.substr(0, d.timestamp_hour.indexOf(' '));})
        .rollup(function(v) {
          return {
            volume: d3.sum(v,function(d) { return d.volume; }),
            hot: d3.sum(v,function(d) { return d.hot; }),
            cold: d3.sum(v,function(d) { return d.cold; }),
            building_id: _this.props.buildingid, //Change this to select building
            apartment_size: parseInt(v[0].apartment_size),
            apartment_number : v[0].apartment_number,
          };
        })
        .entries(data)
        .filter(function(d){
          return d.key!=""&&d.key!="undefined";
        });

      console.log(apartments_dates);



      var get_valid_dates = d3.nest()
        .key(function(d) { return d.timestamp_hour.substr(0, d.timestamp_hour.indexOf(' ')) })
        .rollup(function(v) {
          return {
              data: v,
          };
        })
        .entries(data)
        .filter(function(d){
          return d.key!=""&&d.key!="undefined";
        });

      _this.setState({allDatesData: get_valid_dates}, _this.updateValidData);
    })
  }

  updateApartment = e => {
    this.setState({apartmentid: e.target.id})
  };


  render(){
    const { apartmentNumber, removeSelectedApartment } = this.props;

    let apartmentSelection = null;
    if (apartmentNumber) {
      apartmentSelection = (
        <div className="selected-apartment-container">
          <h4>Apartment {apartmentNumber} selected</h4>

          <button onClick={ removeSelectedApartment }>{ close_icon }</button>
        </div>
      )
    } 

    return(
      <div id="detail-view" data-apartment-selected={ !!this.props.apartmentid }>
        <div className="bg-white detail-view-header-container">
          <div className="detail-view-header container">
            <h1>Water consumption</h1>

            <div className="dates">
              <input
                className="start"
                type="date"
                id="start"
                value={this.state.startDate}
                onChange={this.updateDates}/>

              { arrow_right }

              <input
                className="end"
                type="date"
                id="stop"
                value={this.state.stopDate}
                onChange={this.updateDates}/>
            </div>

            { apartmentSelection }
          </div>
        </div>

        <div className="container full-height my-5">
          <div className="row py-4">
            <div className="col-md-8 p-0 pr-md-4">
              <div className="col-12 p-4 bg-white h-100 chart-shadow">
                <LineChartWarmColdWater startDate={this.state.startDate} stopDate={this.state.stopDate} validData={this.state.dataValidDates} buildingID={this.props.buildingid} apartmentID={this.props.apartmentid}/>
              </div>
            </div>

            <div className="col-md-4 p-0">
              <div className="col-12 p-4 bg-white h-100 chart-shadow">
                <PieChart validData={this.state.dataValidDates} buildingID={this.props.buildingid} apartmentID={this.props.apartmentid}/>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 p-4 bg-white chart-shadow">
              <BubbleChart validData={this.state.dataValidDates} buildingID={this.props.buildingid} apartmentID={this.props.apartmentid}/>
            </div>
          </div>
        </div>
      </div>
		);
	}
}

export default DetailView;
