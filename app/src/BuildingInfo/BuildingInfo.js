import React, {Component} from 'react';
import "./BuildingInfo.css";
//D3 v5
import * as d3 from "d3";

class BuildingInfo extends Component {

  componentDidMount() {
     //this.drawChart();

  }

//Waiting for new props from parent component
  componentDidUpdate(prevProps){
    if (this.props.info !== prevProps.info) {
      //this.setState({data: this.props.data})
      this.getBuildingInfo();
    }
  }

  getBuildingInfo() {
    console.log("infoprop"+this.props.info);

    if(this.props.info != null){
      console.log(this.props.info);

      // const data = this.props.data["10"];
      // console.log(data);
      var apartment_id

        const a = d3.select(".buildingInfo")
        .append("a")
        .attr("width", 1000)
        .attr("height", 300);

        var g = a.selectAll("g")
        .data(Object.values(this.props.info))
        .enter()
        .append("g")
        .text(function(d){return d})
        //.text(function(d){return d.no_apartments})
        //.attr("x", function(d){return d});

      // const apartment = d3.nest()
      // .key(function(d) {
      //   apartment_id = d[5]
      //   console.log(d[5])
      //   return d;
      // })
      // .entries(Object.values(this.props.data));
      //
      // console.log(JSON.stringify(apartment));
      // console.log(apartment_id)
      //this.setState({data: apartment_id})
      //console.log(this.state.apartment)

    }
  }

  getApartmentData(){

  }

  render(){
    return(
    <div className= "col-3">
      <div className="buildingInfo header ">
        <p> Building Info </p>
      </div>
    </div>
  )}

}

export default BuildingInfo;
