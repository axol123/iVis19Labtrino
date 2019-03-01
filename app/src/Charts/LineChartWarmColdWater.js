import React, { Component } from "react";
import "./LineChartWarmColdWater.css";
import data from "../master.json";

//D3 v5
import * as d3 from "d3";

export default class LineChartWarmColdWater extends Component {
	
	//Waiting for new props from parent component
	/*componentDidUpdate(prevProps){
    if (this.props.data !== prevProps.data) {
      this.drawChart();
    }
  }*/

	drawChart(props) {
		// Console log data
		//var option = this.state.timeOption;
		var startDate = new Date(props.startDate);
		var stopDate = new Date(props.stopDate);
		console.log(stopDate);
		stopDate = stopDate.setDate(stopDate.getDate());
		stopDate = new Date(stopDate);
		console.log(startDate);
		console.log(stopDate);
		//console.log(option);
		console.log(data);

		var apartmentId = "00179bc1-d0f5-4e73-9967-74fd48bcc974";

		d3.select("#linechartDate").html(startDate + "\n" + stopDate);

		console.log(new Date(data[0].timestamp_hour))

		var filteredDate = data.filter(
			record =>
				new Date(record.timestamp_hour) >= startDate &&
				new Date(record.timestamp_hour) < stopDate && 
				record.apartment_id === apartmentId
		);
		console.log(filteredDate);

		var margin = { top: 70, right: 70, bottom: 70, left: 70 },
			width = window.innerWidth * 0.5 - margin.left - margin.right, // Use the window's width
			height = window.innerHeight * 0.7 - margin.top - margin.bottom; // Use the window's height

		console.log(margin);
		console.log(width);
		console.log(height);

		// X scale will use the index of our data
		var xScale = d3
			.scaleTime()
			.domain(d3.extent(filteredDate, function(d){return new Date(d.timestamp_hour);}))
			.range([0, width]); // output

		// Y scale will use the randomly generate number
		var yScale = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(filteredDate, function(d) {
					if (parseFloat(d.hot) >= parseFloat(d.cold)) {
						return parseFloat(d.hot);
					} else {
						return parseFloat(d.cold);
					}
				})
			])
			.range([height, 0]); // output

		// D3's line generator
		var lineHot = d3
			.line()
			.x(function(d){return xScale(new Date(d.timestamp_hour))
			})

			// set the x values for the line generator
			.y(function(d) {
				//console.log("hot:" + d.hot);
				return yScale(parseFloat(d.hot));
			}) // set the y values for the line generator
			.curve(d3.curveMonotoneX); // apply smoothing to the line

		// D3's line generator
		var lineCold = d3
			.line()
			.x(function(d){return xScale(new Date(d.timestamp_hour))
			}) // set the x values for the line generator
			.y(function(d) {
				//console.log("cold:" + d.cold);
				return yScale(parseFloat(d.cold));
			}) // set the y values for the line generator
			.curve(d3.curveMonotoneX); // apply smoothing to the line

		console.log(data);

		// Add the SVG to the component
		var svg = d3
			.select("#linechartWarmCold")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		console.log(svg);

		//label for x-axis
		svg
			.append("text")
			.attr("class", "axisLabel")
			.attr(
				"transform",
				"translate(" + width / 2 + " ," + (height + margin.top - 20) + ")"
			)
			.style("text-anchor", "middle")
			.text("Hour");

		// text label for the y axis
		svg
			.append("text")
			.attr("class", "axisLabel")
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - margin.left)
			.attr("x", 0 - height / 2)
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.text("Liters");

		// Call the x axis in a group tag
		svg
			.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

		// Call the y axis in a group tag
		svg
			.append("g")
			.attr("class", "y axis")
			.call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

		// Append the path, bind the data, and call the line generator
		svg
			.append("path")
			.datum(filteredDate) // Binds data to the line
			.attr("class", "line-hot") // Assign a class for styling
			.attr("d", lineHot); // Calls the line generator

		// Append the path, bind the data, and call the line generator
		svg
			.append("path")
			.datum(filteredDate) // Binds data to the line
			.attr("class", "line-cold") // Assign a class for styling
			.attr("d", lineCold); // Calls the line generator

		//  Appends a circle for each datapoint

		svg
			.selectAll(".dot-varm")
			.data(filteredDate)
			.enter()
			.append("circle")
			.attr("class", "dot") // Assign a class for styling
			.attr("cx", function(d, i) {
				return xScale(new Date(d.timestamp_hour))
			})
			.attr("cy", function(d) {
				return yScale(parseFloat(d.hot));
			})
			.attr("r", 5)
		  .on("mouseover", function(d){tooltip.text(d.hot + '\n' + 'liters'); return tooltip.style("visibility", "visible");})
      		.on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-20)+"px").style("left",(d3.event.pageX-220)+"px");})
      		.on("mouseout", function(){return tooltip.style("visibility", "hidden");})
      		.style("fill", "#ff0000");

		// Appends a circle for each datapoint with
		svg
			.selectAll(".dot-cold")
			.data(filteredDate)
			.enter()
			.append("circle")
			.attr("class", "dot") // Assign a class for styling
			.attr("cx", function(d, i) {
				return xScale(new Date(d.timestamp_hour))
			})
			.attr("cy", function(d) {
				return yScale(parseFloat(d.cold));
			})
			.attr("r", 5)
			.on("mouseover", function(d){tooltip.text(d.cold + '\n' + 'liters'); return tooltip.style("visibility", "visible");})
			.on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-20)+"px").style("left",(d3.event.pageX-200)+"px");})
			.on("mouseout", function(){return tooltip.style("visibility", "hidden");})
			.style("fill", "#008cff");

			var tooltip = d3.select("#linechartWarmCold")
				.append("div")
				.style("position", "absolute")
				.style("z-index", "10")
				.style("visibility", "hidden")
				.style("background", "#000")
				.text("a simple tooltip");



	}

	componentDidMount = () => {
		console.log(this.props)
		d3.select("#linechartWarmCold").selectAll("*").remove();
		this.drawChart(this.props);
	}

	componentWillUpdate = (newProps) => {
		console.log(newProps)
		d3.select("#linechartWarmCold").selectAll("*").remove();
		this.drawChart(newProps);
	}




	render() {
		return (
			<div className="container">
			<p> Linechart </p>
			
				<p id="linechartDate" />
			<div id="linechartWarmCold" className="header">
				
			</div>
			</div>
		);
	}
}
