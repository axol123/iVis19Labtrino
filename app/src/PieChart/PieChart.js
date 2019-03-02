import React, {Component} from 'react';
import "./PieChart.css";

//D3 v5
import * as d3 from "d3";

export default class PieChart extends Component {

	componentDidMount() {
    this.drawChart();
  }

  drawChart() {
		var width = 960,
		    height = 500,
		    margin = 40,
		    viewBox="0 0 960 500",
		    perserveAspectRatio="xMinYMid"

		var radius = Math.min(width, height) / 2 - margin

		var data = [9, 20]
		var total = 29; 

		var color = d3.scaleOrdinal()
		  .domain(data)
		  .range(["#FF7675", "#6095F9"])

		var arc = d3.arc()
		    .outerRadius(radius)
		    .innerRadius(110);

		var pie = d3.pie();

		var svg = d3.select("#piechart").append("svg")
		    .datum(data)
		    .attr("width", width)
		    .attr("height", height)
		    .call(responsivefy)
		  .append("g")
		    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		// Text in the center of the pie chart
    svg.append("text")
	   .attr("text-anchor", "middle")
		 .attr('font-size', '2em')
		 .attr('y', 20)
	   .text(total + "k liter");

		var arcs = svg.selectAll("g.arc")
		    .data(pie)
		  .enter().append("g")
		    .attr("class", "arc");

		arcs.append("path")
		    .attr("fill", function(d, i) { return color(i); })
		  .transition()
		    .ease(d3.easeCircleIn)
		    .duration(2000)
		    .attrTween("d", tweenPie);

		function tweenPie(b) {
		  b.innerRadius = 0;
		  var i = d3.interpolateObject({startAngle: 0, endAngle: 0}, b);
		  return function(t) { return arc(i(t)); };
		}

		function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type, 
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}
	}

	render(){
	    return(
	    	<div className="container-fluid bg-light text-dark">
	    		<p> Overall Consumption</p>
	    	<div className="m-0" id="piechart"></div>
	    		<div className="row w-100 m-3">
	    			<table className="w-100">
	    				<tbody>
	    					<tr>
	    						<td>
	    							<div className="d-flex flex-row align-items-center">
  										<div className="box red"></div>
  										<p className="pl-5 m-0">Hot water</p>
  									</div>
  								</td>
	    						<td><p>%</p></td>
	    						<td><p>liter</p></td>
	    					</tr>
	    					<tr>
	    						<td>
	    							<div className="d-flex flex-row align-items-center">
  										<div className="box blue"></div>
  										<p className="pl-5 m-0">Cold water</p>
  									</div>
  								</td>
	    						<td><p>%</p></td>
	    						<td><p>liter</p></td>
	    					</tr>
	    				</tbody>
	    			</table>
	    		</div>
	    	</div>
	    )
	}
}
