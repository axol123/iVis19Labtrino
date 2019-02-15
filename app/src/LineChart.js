import React, {Component} from 'react';

//D3 v5
import * as d3 from "d3";

class LineChart extends Component {

  componentDidMount() {

  }

//Waiting for new props from parent component
  componentDidUpdate(prevProps){
    if (this.props.data !== prevProps.data) {
      this.drawChart();
      //console.log(this.props.data);
    }


  }

  drawChart() {

    console.log(this.props.data[0]["10"]);
    // const hello = this.props.data;
    // console.log(hello)

    const data = [12, 5, 6, 6, 9, 10];
    //const data = this.props.data;
    const svg = d3.select(".linechart").append("svg").attr("width", 700).attr("height", 300);

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
    return <div className="linechart"></div>
  }

}

export default LineChart;
