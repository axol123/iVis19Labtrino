import React, { Component } from "react";
import "./LineChartWarmColdWater.css";

//D3 v5
import * as d3 from "d3";

export default class LineChartWarmColdWater extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.chartContainer = null
  }

  //////////PROPS FROM PARENT ////////////////
  //startDate={this.state.startDate}
  //stopDate={this.state.stopDate}
  //validData={this.state.dataValidDates}
  //buildingID={this.props.buildingid}
  //apartmentID={this.state.apartmentid}


  drawChart(props) {
    // Console log data
    //var option = this.state.timeOption;

    var startDate = new Date(this.props.startDate);
    var stopDate = new Date(this.props.stopDate);
    console.log(stopDate);
    stopDate = stopDate.setDate(stopDate.getDate()+1);
    stopDate = new Date(stopDate);
    //console.log(startDate);
    //console.log(stopDate);
    //console.log(option);
    //console.log(data);

    // console.log("data down in linechart")
    // console.log(this.props.validData)

    //var apartmentId = "00179bc1-d0f5-4e73-9967-74fd48bcc974";
    var apartmentId = this.props.apartmentID;
    var buildingId = this.props.buildingID;



    //d3.select("#linechartDate").html(startDate + "\n" + stopDate);

    //	console.log(new Date(data[0].timestamp_hour))

    var filteredDate = [];

    // var filteredDate = data.filter(
    // 	record =>
    // 		new Date(record.timestamp_hour) >= startDate &&
    // 		new Date(record.timestamp_hour) < stopDate &&
    // 		record.apartment_id === apartmentId
    // );


    var amountDays;

    if(this.props.validData != null){
      var arr = this.props.validData;
      amountDays = arr.length;

      //console.log("amout of days" + arr.length)

      //If the input date range is less than 5 days - display consumption on HOURS
      if(amountDays < 5){
        if(this.props.apartmentID != null){
          var filterData = this.props.validData.map(da =>
            da.value.data.filter(function(d){
              return d.apartment_id === apartmentId
            })
            //d.apartment_id === apartmentId
          )
          console.log("after filter"+filterData)
          filterData.map(ba => ba.forEach(function(d){return filteredDate.push(d)}))
        }
        else {
          var filterData = this.props.validData.map(da =>
            da.value.data.filter(function(d){
              return d.building_id === buildingId
            }));

            console.log("after filter"+filterData)
            filterData.map(ba => ba.forEach(function(d){return filteredDate.push(d)}))

            console.log("after new array "+filteredDate)

            var nestedData = d3.nest()
            .key(function(d) { return d.timestamp_hour })
            .rollup(function(v) {
              return {
                timestamp_hour: v[0].timestamp_hour,
                volume: d3.sum(v,function(d) { return d.volume; }),
                hot: d3.sum(v,function(d) { return d.hot; }),
                cold: d3.sum(v,function(d) { return d.cold; }),
              };
            })
            .entries(filteredDate)
            .filter(function(d){
              return d.key!=""&&d.key!="undefined";
            });

            filteredDate = [];
            nestedData.map(ba => filteredDate.push(ba.value))
          }
        }
        //If the input date range is more than 5 days - display consumption on DAYS
        else{

          if(this.props.apartmentID != null){
          //if(apartmentId != null){
          console.log("new apartmentID"+this.props.apartmentID)

            var filterData = this.props.validData.map(da =>
              da.value.data.filter(function(d){
                return d.apartment_id === apartmentId
              })
              //d.apartment_id === apartmentId
            )
            filterData.map(ba => ba.forEach(function(d){return filteredDate.push(d)}))

            filteredDate.map(ba => console.log(ba.timestamp_hour.substr(0, ba.timestamp_hour.indexOf(' '))))

            var nestedData = d3.nest()
            .key(function(d) { return d.timestamp_hour.substr(0, d.timestamp_hour.indexOf(' '))})
            .rollup(function(v) {
              return {
                //Is now once a day
                timestamp_hour: v[0].timestamp_hour,
                volume: d3.sum(v,function(d) { return d.volume; }),
                hot: d3.sum(v,function(d) { return d.hot; }),
                cold: d3.sum(v,function(d) { return d.cold; }),
              };
            })
            .entries(filteredDate)
            .filter(function(d){
              return d.key!=""&&d.key!="undefined";
            });

            filteredDate = [];
            nestedData.map(ba => filteredDate.push(ba.value))

          }

          else {
            //console.log("not in da thing we want to test :(")

            var filterData = this.props.validData.map(da =>
              da.value.data.filter(function(d){
                return d.building_id === buildingId
              }));

              //console.log("after filter"+filterData)
              filterData.map(ba => ba.forEach(function(d){return filteredDate.push(d)}))

              //console.log("after new array "+filteredDate)

              var nestedData = d3.nest()
              .key(function(d) { return d.timestamp_hour.substr(0, d.timestamp_hour.indexOf(' ')) })
              .rollup(function(v) {
                return {
                  timestamp_hour: v[0].timestamp_hour,
                  volume: d3.sum(v,function(d) { return d.volume; }),
                  hot: d3.sum(v,function(d) { return d.hot; }),
                  cold: d3.sum(v,function(d) { return d.cold; }),
                };
              })
              .entries(filteredDate)
              .filter(function(d){
                return d.key!=""&&d.key!="undefined";
              });

              filteredDate = [];
              nestedData.map(ba => filteredDate.push(ba.value))
            }



        }
      }


      const containerWidth = Number(d3.select(this.$chartContainer).style("width").slice(0, -2));
      const containerHeight = Number(d3.select(this.$chartContainer).style("height").slice(0, -2));
      console.log(containerWidth);
      var margin = { top: 70, right: 70, bottom: 70, left: 70 },
      width = containerWidth - margin.left - margin.right, // Use the window's width
      height = containerHeight - margin.top - margin.bottom,
      viewBox="0 0 1100 500",
      perserveAspectRatio="xMinYMid"; // Use the window's height

      // console.log(margin);
      // console.log(width);
      // console.log(height);

      // X scale will use the index of our data
      var xScale = d3
      .scaleTime()
      .domain(d3.extent(filteredDate, function(d){ return new Date(d.timestamp_hour);}))
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

      //console.log(data);

      // Add the SVG to the component
      var svg = d3
      .select(this.$chartContainer)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      //.call(responsivefy)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //console.log(svg);

      //label for x-axis
      svg
      .append("text")
      .attr("class", "axisLabel")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top - 20) + ")"
      )
      .style("text-anchor", "middle")
      .text("Time");

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
      .call(d3.axisBottom(xScale))
      .style("font-size",15); // Create an axis component with d3.axisBottom

      // Call the y axis in a group tag
      svg
      .append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale).tickFormat(d3.format(".0f")))
      .style("font-size",15); // Create an axis component with d3.axisLeft

      // Append the path, bind the data, and call the line generator
      svg
      .append("path")
      .datum(filteredDate) // Binds data to the line
      .attr("class", "line-hot") // Assign a class for styling
      .attr("d", lineHot) // Calls the line generator
      //.attr("data-legend", "Hot");

      // Append the path, bind the data, and call the line generator
      svg
      .append("path")
      .datum(filteredDate) // Binds data to the line
      .attr("class", "line-cold") // Assign a class for styling
      .attr("d", lineCold) // Calls the line generator
    //.attr("data-legend", "Cold");
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
      .on("mouseover", function(d){tooltip.text( 'Hot water: ' + parseFloat(d.hot).toFixed()  + '\n' + 'liters').style("font-size","15px").style("background-color","#FF7675").style("padding", "10pt").style("color","#fff").style("border-radius","5px"); return tooltip.style("visibility", "visible");})
      .on("mousemove", function(){return tooltip.style("top", `${ parseInt(d3.select(this).attr("cy")) }px`).style("left",`${ parseInt(d3.select(this).attr("cx")) }px`)})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
      .style("fill", "#FF7675");

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
      .on("mouseover", function(d){tooltip.text('Cold water: ' + parseFloat(d.cold).toFixed() + '\n' + 'liters').style("font-size","15px").style("background-color","#6095F9").style("padding", "10pt").style("border-radius","5px").style("color","#fff").style( "box-shadow", "1px 1px 20px #a7a4a4"); return tooltip.style("visibility", "visible");})
      .on("mousemove", function(){return tooltip.style("top", `${ parseInt(d3.select(this).attr("cy")) }px`).style("left",`${ parseInt(d3.select(this).attr("cx")) }px`)})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
      .style("fill", "#6095F9");

      var tooltip = d3.select(this.$chartContainer)
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background", "#000")
      .text("a simple tooltip");

      var legendRectSize = 10;
      var legendSpacing = 1;

      var legendHot = svg.selectAll('.legendHot')                     // NEW
         .data([" Hot"])                                   // NEW
         .enter()                                                // NEW
         .append('g')                                            // NEW
         .attr('class', 'legendHot')                                // NEW
         .attr('transform', function(d, i) {                     // NEW

           return 'translate(' + width+ ',' + 50+ ')';        // NEW
         });
                                                  // NEW
       legendHot.append('rect')                                     // NEW
         .attr('width', legendRectSize)                          // NEW
         .attr('height', legendRectSize)                         // NEW
         .style('fill', "#FF7675")                                   // NEW
         .style('stroke', "#FF7675");


       legendHot.append('text')                                     // NEW
         .attr('x', legendRectSize + legendSpacing)              // NEW
         .attr('y', legendRectSize - legendSpacing)              // NEW
         .text(function(d) { return d; });

         var legendCold = svg.selectAll('.legendCold')                     // NEW
            .data(["Cold"])                                   // NEW
            .enter()                                                // NEW
            .append('g')                                            // NEW
            .attr('class', 'legendCold')                                // NEW
            .attr('transform', function(d, i) {                     // NEW
              // var height = legendRectSize + legendSpacing;          // NEW
              // var offset =  height / 2;     // NEW
              // var horz = -2 * legendRectSize;                       // NEW
              // var vert = i * height - offset;                       // NEW
              return 'translate(' + width + ',' + 20 + ')';        // NEW
            });
                                                     // NEW
          legendCold.append('rect')                                     // NEW
            .attr('width', legendRectSize)                          // NEW
            .attr('height', legendRectSize)                         // NEW
            .style('fill', "#6095F9")                                   // NEW
            .style('stroke', "#6095F9");

          legendCold.append('text')                                     // NEW
            .attr('x', legendRectSize + legendSpacing)              // NEW
            .attr('y', legendRectSize - legendSpacing)              // NEW
            .text(function(d) { return d; });


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



  componentDidMount = () => {
    console.log(this.props)
    d3.select(this.$chartContainer).selectAll("*").remove();
    this.drawChart(this.props);
  }

  componentWillUpdate = (newProps) => {
    console.log(newProps)
    d3.select(this.$chartContainer).selectAll("*").remove();
    //  if(newProps !== prevProps){
    this.drawChart(newProps);
    //  }
  }

  componentDidUpdate = (newProps) => {
    if(this.prevProps !== newProps){
      d3.select(this.$chartContainer).selectAll("*").remove();
      //  if(newProps !== prevProps){
      this.drawChart(newProps);
    }
  }



  render() {
    return (
      <div id="line-chart">
        <header>
          <h2>Consumption Breakdown</h2>
        </header>

        <div className="chart-container" ref={ element => this.$chartContainer = element }></div>
      </div>
    )
  }
}
  