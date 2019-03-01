import React, {Component} from 'react';

//D3 v5
import * as d3 from "d3";

class LineChart extends Component {

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
    console.log(this.props.data);
    if(this.props.data != null){
      const data = [];
      const obj = this.props.data;

      //It should be some better way of doing this e.g. create an object
      Object.keys(obj).forEach(function(key) {
        data.push(obj[key])
      });

      //const data = this.props.data;
      const svg = d3.select(".linechart")
      .append("svg")
      .attr("width", 700)
      .attr("height", 200);

      svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x",  (d, i) => i * 5)
      .attr("y", 0)
      .attr("width", 5)
      .attr("height", function(d) { return d[1] })
      .attr("fill", "green");
    }

  }
  render(){
    return(
    <div className="linechart header">
    <p> Linechart </p>
    </div>
  )}

}

export default LineChart;
