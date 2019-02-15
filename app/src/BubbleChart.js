import React, {Component} from 'react';

//D3 v5
import * as d3 from "d3";

class BubbleChart extends Component {

  componentDidMount() {
  this.drawChart();
  }

  drawChart() {

    const data = [12, 5, 6, 6, 9, 10];
    const svg = d3.select(".bubblechart").append("svg").attr("width", 700).attr("height", 300);

    svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 70)
    .attr("y", 0)
    .attr("width", 25)
    .attr("height", (d, i) => d)
    .attr("fill", "green");

  }
  render(){
    return <div className="bubblechart"></div>
  }

}

export default BubbleChart;
