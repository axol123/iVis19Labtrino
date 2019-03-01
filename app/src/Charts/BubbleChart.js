import React, {Component} from 'react';
import data from '../master.csv';


//D3 v5
import * as d3 from "d3";

class BubbleChart extends Component {

  componentDidMount() {

    //Here we should get the apartment id and the timespan
     this.drawChart();

     console.log("did mount"+this.props.data)

  }

//Waiting for new props from parent component
  componentDidUpdate(prevProps){
    if (this.props.data !== prevProps.data) {
      console("new data"+this.props.dat)
      this.drawChart();
    }
  }

  drawChart() {

      d3.csv(data).then(function(data) {
        console.log(data)
      })

      var width  = 800,
    height = 700;

  console.log("before svg");
  var svg = d3.select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("transform", "translate(0,0)")

  // Forces on the bubbles
  var sim = d3.forceSimulation();

  // var forceX_separate = d3.forceX(function(d) {
  //     if(d.value.building_id==0){
  //       return (width/2)-(width/3);
  //     }
  //     if(d.value.building_id==1){
  //       return width/2;
  //     }
  //     if(d.value.building_id==2){
  //       console.log(d);
  //       return (width/2)+(width/3);
  //     }
  //   }).strength(0.05)

  var forceX_combine = d3.forceX(function(d) {
      return width/2;
    }).strength(0.05)

  var forceY = d3.forceY(function(d) {
      return height/2;
    }).strength(0.05)

  var forceX_separate_rooms = d3.forceX(function(d) {
    console.log(d.value.apartment_size);
    if(d.value.apartment_size==1){
      return (width/2)-(width/3);
    }
    if(d.value.apartment_size==2){
      return (width/2)+(width/3);
    }
    if(d.value.apartment_size==3){
      return (width/2)-(width/3);
    }
    if(d.value.apartment_size==4){
      return (width/2)+(width/3);
    }
    }).strength(0.05)

  var forceY_separate_rooms = d3.forceY(function(d) {
      if(d.value.apartment_size==1){
        return (height/2)-(height/4);
      }
      if(d.value.apartment_size==2){
        return (height/2)-(height/4);
      }
      if(d.value.apartment_size==3){
        return (height/2)+(height/4);
      }
      if(d.value.apartment_size==4){
        return (height/2)+(height/4);
      }
    }).strength(0.05)


  var tooltip = d3.select("#chart")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  var force_collide;

  d3.csv(data).then(function(datapoints) {
  //d3.csv("infoviz.csv", function(datapoints){

    var get_building_id = function(d) {
      var id_list = ["1bbf041c-f23c-437e-9c9b-2bd43d310a7c"]//, "52b41c98-ab21-4ad5-828b-74069bcd55e7", "c8f283c8-4e1f-4e59-8364-6e8bd70a2c24"];
      if(id_list.indexOf(d)==-1){
      //  console.log(d);
      }
      return id_list.indexOf(d);
      //console.log(id_list.indexOf(d));
    }

    var apartments = d3.nest()
      .key(function(d) {
        return d.apartment_id;
      })
      .rollup(function(v) {
        return {
          volume: d3.sum(v,function(d) { return d.volume; }),
          hot: d3.sum(v,function(d) { return d.hot; }),
          cold: d3.sum(v,function(d) { return d.cold; })
        };
      })
      .entries(datapoints)
      .filter(function(d){
        return d.key!=""&&d.key!="undefined";
      });

    // var apartments_hours = d3.nest()
    //   .key(function(d) {
    //     return d.timestamp_hour;
    //   })
    //   .key(function(d) {
    //     return d.apartment_id;
    //   })
    //   .rollup(function(v) {
    //     return {
    //       volume: d3.sum(v,function(d) { return d.volume; }),
    //       hot: d3.sum(v,function(d) { return d.hot; }),
    //       cold: d3.sum(v,function(d) { return d.cold; })
    //     };
    //   })
    //   .entries(datapoints)
    //   .filter(function(d){
    //     return d.key!=""&&d.key!="undefined";
    //   });


    var apartments_dates = d3.nest()
      .key(function(d) {
        return d.timestamp_hour.substr(0, d.timestamp_hour.indexOf(' '));
      })
      .key(function(d) {
        return d.apartment_id;
      })
      .rollup(function(v) {
        return {
          volume: d3.sum(v,function(d) { return d.volume; }),
          hot: d3.sum(v,function(d) { return d.hot; }),
          cold: d3.sum(v,function(d) { return d.cold; }),
          building_id: get_building_id(v[0].building_id),
          apartment_size: parseInt(v[0].apartment_size)
        };
      })
      .entries(datapoints)
      .filter(function(d){
        return d.key!=""&&d.key!="undefined";
      });


    // var apartments_months = d3.nest()
    //   .key(function(d) {
    //     return d.timestamp_hour.substr(0, 7);
    //   })
    //   .key(function(d) {
    //     return d.apartment_id;
    //   })
    //   .rollup(function(v) {
    //     return {
    //       volume: d3.sum(v,function(d) { return d.volume; }),
    //       hot: d3.sum(v,function(d) { return d.hot; }),
    //       cold: d3.sum(v,function(d) { return d.cold; })
    //     };
    //   })
    //   .entries(datapoints)
    //   .filter(function(d){
    //     return d.key!=""&&d.key!="undefined";
    //   });



    //console.log(apartments_hours);


    // month test
    // console.log(apartments_months);
    // apartments=apartments_months.find(d => d.key ==="2018-12").values;

    // Date test
    console.log(apartments_dates);
    apartments=apartments_dates.find(d => d.key ==="2019-01-07").values;
    console.log(apartments);

    // Hour test
    // apartments=apartments_hours.find(d => d.key ==="2018-12-31 14:00:00+00").values;
    // console.log(apartments);

    //Find apartment with highest and lowest water consumption
    var max = 0;
    var min = 20000;
    var max_apartment;
    var min_apartment;
    apartments.forEach(function(d) {
      if (d.value.volume>max){
        max = d.value.volume;
        max_apartment=d;
      }
      if (d.value.volume<min){
        min = d.value.volume;
        min_apartment=d;
      }
    });

    var showTooltip = function(d) {
        tooltip
          .transition()
          .duration(200)
        tooltip
          .style("opacity", 1)
          .html("Building: nr "+ (d.value.building_id+1) + ", Rooms: "+ d.value.apartment_size + ", Water volume: " + d.value.volume+  ", Hot water: " + d.value.hot + ", Cold water "+ d.value.cold)
          .style("left", (d3.mouse(this)[0]+30) + "px")
          .style("top", (d3.mouse(this)[1]+30) + "px")
      }
      var moveTooltip = function(d) {
        tooltip
          .style("left", (d3.mouse(this)[0]+30) + "px")
          .style("top", (d3.mouse(this)[1]+30) + "px")
      }
      var hideTooltip = function(d) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0)
      }


    var radius_scale = d3.scaleSqrt().domain([min, max]).range([4, 30]);

    force_collide = d3.forceCollide(function(d) {
        return radius_scale(d.value.volume) + 1;
    })

    sim
      .force("x", forceX_combine)
      .force("y", forceY)
      .force("collide", force_collide)

    var circles = svg.selectAll(".apartment_id")
      .data(apartments)
      .enter().append("circle")
      .attr("class", "apartment")
      .attr("r", function(d){
        return radius_scale(d.value.volume);
      })
      .attr("fill", function(d){
        var hot_percentage=d.value.hot/d.value.volume*100;
        var cold_percentage=d.value.cold/d.value.volume*100;
        // Konstig data eller fel i rollup?
        // console.log(d.value.hot)
        // console.log(d.value.cold)
        // console.log(hot_percentage);
        // console.log(cold_percentage);
        var grad = svg.append("defs").append("linearGradient").attr("id", "grad"+d.key)
            .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
        grad.append("stop").attr("offset", cold_percentage+"%").style("stop-color", "lightblue");
        grad.append("stop").attr("offset", hot_percentage+"%").style("stop-color", "tomato");
        return "url(#grad"+d.key+")"
      })
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseout", hideTooltip)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))



    sim.nodes(apartments)
      .on('tick', tick)


    console.log(min_apartment);
    console.log(max_apartment);

    function tick() {
      circles
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
    }

  })

  function dragstarted(d){
    if (!d3.event.active) sim.alphaTarget(0.003).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d){
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d){
    if (!d3.event.active) sim.alphaTarget(0).restart();
    d.fx = null;
    d.fy = null;

  }

  // Make cleaner
  var wait1=true;
  var wait2=true;
  var wait3=true;

  // d3.select("#building").on('click', function() {
  //   wait2,wait3=false;
  //   wait1=true;
  //   sim
  //     .force("x", forceX_separate)
  //     .force("y", forceY.strength(0.01))
  //     .alphaTarget(0.25)
  //     .restart()
  //
  //
  //     setTimeout(function() {
  //       if(wait1){
  //         sim
  //           .alphaTarget(0)
  //           .restart()
  //         }
  //      }, 7000);
  // })
  //
  // d3.select("#rooms").on('click', function() {
  //   wait1,wait3=false;
  //   wait2=true;
  //   sim
  //     .force("x", forceX_separate_rooms)
  //     .force("y", forceY_separate_rooms.strength(0.1))
  //     .alphaTarget(0.3)
  //     .restart()
  //
  //     setTimeout(function() {
  //       if(wait2){
  //         sim
  //           .alphaTarget(0)
  //           .restart()
  //       }
  //      }, 7000);
  // })
  //
  // d3.select("#combine").on('click', function() {
  //   wait1,wait2=false;
  //   wait3=true;
  //   sim
  //     .force("x", forceX_combine)
  //     .force("y", forceY.strength(0.05))
  //     .alphaTarget(0.2)
  //     .restart()
  //
  //     setTimeout(function() {
  //       if(wait3){
  //         sim
  //           .alphaTarget(0)
  //           .restart()
  //       }
  //      }, 4000);
  //
  //})
  }
  render(){
    return(
      <div className="col-8">
        <div id="chart">
          <p>Bubblechart</p>
        </div>
      </div>
  )}

}

export default BubbleChart;
