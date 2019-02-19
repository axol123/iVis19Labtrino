import React, {Component} from 'react';

//D3 v5
import * as d3 from "d3";

class MapView extends Component {

  componentDidMount() {

  }

//Waiting for new props from parent component
  componentDidUpdate(prevProps){
    if (this.props.data !== prevProps.data) {
      this.drawChart();
    }
  }

  drawChart() {

    // const data = [];
    // const obj = this.props.data[0];
    //
    // //It should be some better way of doing this e.g. create an object
    // Object.keys(obj).forEach(function(key) {
    //   data.push(obj[key])
    // });
    //
    // //const data = this.props.data;
    // const svg = d3.select(".linechart").append("svg").attr("width", 1000).attr("height", 300);
    //
    // svg.selectAll("rect")
    // .data(data)
    // .enter()
    // .append("rect")
    // .attr("x",  (d, i) => i * 5)
    // .attr("y", 0)
    // .attr("width", 5)
    // .attr("height", function(d) { return d[1] })
    // .attr("fill", "green");

  }
  render(){
    return <div className="linechart header">Map</div>
  }

}

export default MapView;
