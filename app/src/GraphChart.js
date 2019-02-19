import React, {Component} from 'react';
import data from './one_building_hour.csv';

//D3 v5
import * as d3 from "d3";

export default class GraphChart extends Component {
    

  componentDidMount() {
    this.drawChart();

  }

//Waiting for new props from parent component
  componentDidUpdate(prevProps){
    if (this.props.data !== prevProps.data) {
   

      //console.log(this.props.data);
    }


  }

  drawChart() {

   // console.log(this.props.data[0]["10"]);
    // const hello = this.props.data;
    // console.log(hello)

    var margin = {top: 10, right: 30, bottom: 100, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    //const data = this.props.data;
    const svg = d3.select("#graph-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

        d3.csv(data).then(function(data) {
   
    console.log(data)
    console.log(d3.extent(data, function(d){ return new Date(d.timestamp_hour);} ))

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d){return new Date(d.timestamp_hour)}))
      .range([ 0, width ]);


    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
     
      // Add Y axis

    var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.volume; })])
    .range([ height, 0 ]);

  var yAxis = svg.append("g")
    .call(d3.axisLeft(y));
  // Add a clipPath: everything out of this area won't be drawn.
  
  var clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);
 
  
      // Add brushing
  var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function
  
  
      // Create the line variable: where both the line and the brush take place
  var line = svg.append('g')
    .attr("clip-path", "url(#clip)")

  // Add the line - total volume
  line.append("path")
    .datum(data)
    .attr("class", "line_vol")  // I add the class line to be able to modify this line later on.
    .attr("fill", "none")
    .attr("stroke", "limegreen")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(new Date(d.timestamp_hour)) })
      .y(function(d) { return y(d.volume) })
      )
    // console.log(d.date); console.log(d.volume); 


  // Add the line - hot water
  line.append("path")
    .datum(data)
    .attr("class", "line_hot")  // I add the class line to be able to modify this line later on.
    .attr("fill", "none")
    .attr("stroke", "crimson")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(new Date(d.timestamp_hour)) })
      .y(function(d) { return y(d.hot) })
      )

  // Add the line - cold water
  line.append("path")
    .datum(data)
    .attr("class", "line_cold")  // I add the class line to be able to modify this line later on.
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(new Date(d.timestamp_hour)) })
      .y(function(d) { return y(d.cold) })
      )


  // Add the brushing
  line
    .append("g")
      .attr("class", "brush")
      .call(brush);

  // A function that set idleTimeOut to null
  var idleTimeout
  function idled() { idleTimeout = null; }

  // A function that update the chart for given boundaries
  function updateChart() {
    // What are the selected boundaries?
    var extent = d3.event.selection
    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      x.domain([ 4,8])
    }else{
      x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
      line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }
    // Update axis and line position
    xAxis.transition().duration(1000).call(d3.axisBottom(x))
    line
        .select('.line_vol')
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(new Date(d.timestamp_hour)) })
          .y(function(d) { return y(d.volume) })
        )
    // Update axis and line position
    xAxis.transition().duration(1000).call(d3.axisBottom(x))
    line
        .select('.line_hot')
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(new Date(d.timestamp_hour)) })
          .y(function(d) { return y(d.hot) })
        )
    // Update axis and line position
    xAxis.transition().duration(1000).call(d3.axisBottom(x))
    line
        .select('.line_cold')
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(new Date(d.timestamp_hour)) })
          .y(function(d) { return y(d.cold) })
        )
  }
  // If user double click, reinitialize the chart
  svg.on("dblclick",function(){
    x.domain(d3.extent(data, function(d) { return new Date(d.timestamp_hour); }))
    xAxis.transition().call(d3.axisBottom(x))
    line
      .select('.line_vol')
      .transition()
      .attr("d", d3.line()
        .x(function(d) { return x(new Date(d.timestamp_hour)) })
        .y(function(d) { return y(d.volume) })
    )
    xAxis.transition().call(d3.axisBottom(x))
    line
      .select('.line_hot')
      .transition()
      .attr("d", d3.line()
        .x(function(d) { return x(new Date(d.timestamp_hour)) })
        .y(function(d) { return y(d.hot) })
    )
    xAxis.transition().call(d3.axisBottom(x))
    line
      .select('.line_cold')
      .transition()
      .attr("d", d3.line()
        .x(function(d) { return x(new Date(d.timestamp_hour)) })
        .y(function(d) { return y(d.cold) })
    )
  });
/*
  // If user double click, reinitialize the chart
  svg.on("dblclick",function(){
    x.domain(d3.extent(data, function(d) { return d.date; }))
    
  });
*/
})



  }
  render(){
 

    return <div id="graph-chart">
    </div>
  }

}