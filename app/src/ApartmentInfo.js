import React, {Component} from 'react';

//D3 v5
import * as d3 from "d3";

class ApartmentInfo extends Component {

  componentDidMount() {
     this.drawChart();

  }

//Waiting for new props from parent component
  componentDidUpdate(prevProps){
    if (this.props.data !== prevProps.data) {
      this.drawChart();
    }
  }

  drawChart() {

    if(this.props.data != null){
      console.log(this.props.data);

      // const data = this.props.data["10"];
      // console.log(data);

        const a = d3.select(".apartmentInfo").append("a").attr("width", 1000).attr("height", 300);
        var g = a.selectAll("g")
        .data(Object.values(this.props.data))
        .enter()
        .append("g")
        .attr("x", function(d){return d});

      // const apartment = d3.nest()
      // .key(function(d) {
      //   console.log(d)
      //   return d;
      // })
      // .entries(this.props.data);
      //
      // console.log(JSON.stringify(apartment));

    }

  }
  render(){
    return(
    <div className="apartmentInfo">
    <p> ApartmentInfo </p>
    </div>
  )}

}

export default ApartmentInfo;
