import React, {Component} from 'react';
import BuildingInfo from '../BuildingInfo/BuildingInfo';
import LineChart from '../Charts/LineChart';
import BubbleChart from '../Charts/BubbleChart';
import GraphChart from '../Charts/GraphChart';
import LineChartWarmColdWater from '../Charts/LineChartWarmColdWater';
import SelectApartment from "../SelectApartment/SelectApartment";
import csv from '../master.csv';

//D3 v5
import * as d3 from "d3";

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

  componentDidMount() {

    //this.readData();
    console.log(this.props.buildingid);

  }

//Waiting for new props from parent component
  componentDidUpdate(prevProps){
    //console.log(this.props.building);
    if (this.props.buildingid !== prevProps.buildingid) {
        this.readData();
        //console.log(this.props.building);
        //console.log("state "+this.state.buildingInfo)
   }
  }

  updateDates = e => {
    var newDate = e.target.value;
    console.log("Line chart updated");
    console.log(newDate);

    if (e.target.id == "start") {
      console.log(newDate);
      this.setState({ startDate: newDate }, this.updateValidData );
    } else if (e.target.id == "stop") {
      console.log(newDate);
      this.setState({ stopDate: newDate}, this.updateValidData);
    }

  }

  updateValidData() {
    console.log("statrrt: "+this.state.startDate + "stop "+this.state.stopDate  )

    var newValidDates= this.state.allDatesData.filter(d => d.key >= this.state.startDate && d.key <= this.state.stopDate);
    console.log("from filter "+newValidDates);

    this.setState({ dataValidDates: newValidDates });
    //console.log("from State"+this.state.dataValidDates);

  }



  readData() {

  //  console.log("current id "+this.props.buildingid)
    var _this = this;

    d3.csv(csv).then(function(data) {
    //  console.log(data)


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
              apartment_size: parseInt(v[0].apartment_size)
            };
          })
          .entries(data)
          .filter(function(d){
            return d.key!=""&&d.key!="undefined";
          });



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
          //console.log(get_valid_dates)
          _this.setState({allDatesData: get_valid_dates}, _this.updateValidData);



          //
          // //Nest på apartments per building
          // var validApartments = d3.nest()
          //   .key(function(d) { return d.building_id })
          //   .rollup(function(v) {
          //     return {
          //       //building_id: v[1].building_id,
          //       no_apartments: d3.set(v,function(d) { return d.apartment_id }).size(),
          //       apartment_id: d3.set(v,function(d) { return d.apartment_id }),
          //     };
          //   })
          //   .entries(data)
          //   .filter(function(d){
          //     return d.key!=""&&d.key!="undefined";
          //   });
          //
          //   console.log("THESE ARE VALID APARTMENTS YO:"+validApartments.map(function(d){console.log(d )}));
    })



 // 1- Alla byggnader ---
 //   1- Gruppera på datum (summera vattenkonsumtion)
 //   2- och en som aggregerar på hour (summera vattenkonsumtion)
 //   3- Till bubbleChart - aggregerad på byggnad och apartment


 //2- En vald byggnad ---
 //   1- Gruppera på datum och filtra ut byggnad


  }
  updateApartment = e => {
    console.log(e.target.id);
    this.setState({apartmentid: e.target.id})
  };


  render(){
          //<LineChart data={this.props.data}/>

        // <BubbleChart />
       // <GraphChart />
       //  <LineChartWarmColdWater startDate={this.state.startDate} stopDate={this.state.stopDate} />
//console.log("valid dates from state"+this.state.dataValidDates);
//console.log("all dates from state"+this.state.allDatesData);

    return(
    <div className="col-10 p-0">
      <div className="detailView header">
      <SelectApartment info={this.state.buildingInfo} updateApartment={this.updateApartment}/>
      <BuildingInfo info={this.state.buildingInfo}/>

      <p>Start</p>
       <input
         type="date"
         id="start"
         value={this.state.startDate}
         onChange={this.updateDates}
       />
       <p>Stop</p>
       <input
         type="date"
         id="stop"
         value={this.state.stopDate}
         onChange={this.updateDates}
       />
     <p> Details</p>
      <LineChartWarmColdWater startDate={this.state.startDate} stopDate={this.state.stopDate} validData={this.state.dataValidDates} buildingID={this.props.buildingid} apartmentID={this.state.apartmentid}/>





      </div>
    </div>

  );
}

}

export default DetailView;
