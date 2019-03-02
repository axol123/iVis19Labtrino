import React, {Component} from 'react';
//import "./PieChart.css";

//D3 v5
import * as d3 from "d3";

export default class BubbleChart extends Component {
  constructor(props) {
    super(props);
    this.state={
      circles: null,
      // width: 1000,
      // height: 1000,
      // wait_apartments: false,
      // wait_combine: false,
      // wait_volume: false,
      // wait_hot: false,
      // wait_cold: false,
    };
    this.max = 0;
    this.min = 20000;
    this.max_hot = 0;
    this.min_hot = 20000;
    this.max_cold = 0;
    this.min_cold = 20000;
    this.width = 1000;
    this.height = 1000;

    // this.max = this.max.bind(this);
    // this.min = this.min.bind(this);
    // this.max_hot = this.max_hot.bind(this);
    // this.min_hot = this.min_hot.bind(this);
    // this.max_cold = this.max_cold.bind(this);
    // this.min_cold = this.min_cold.bind(this);
    //
    // this.max_apartment = this.max_apartment.bind(this);
    // this.min_apartment = this.min_apartment.bind(this);


  }

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate = (newProps) => {
    if(this.prevProps !== newProps){
      //d3.select("#piechart").selectAll("*").remove();
      //  if(newProps !== prevProps){
      this.drawChart();
    }
  }

  //////////PROPS FROM PARENT ////////////////
  //validData={this.state.dataValidDates}
  //buildingID={this.props.buildingid}
  //apartmentID={this.state.apartmentid}


  drawChart() {
    var filteredDate = [];
    if(this.props.validData != null){

      var buildingId = this.props.buildingID;
      var apartmentId = this.props.apartmentID;

      if(this.props.buildingID != null){



        var filterData = this.props.validData.map(da =>
          da.value.data.filter(function(d){
            return d.building_id === buildingId
          })
        )
        filterData.map(ba => ba.forEach(function(d){return filteredDate.push(d)}))

        console.log("HÄÄÄÄR")
        //  filteredDate.map(ba => console.log(ba))

        var nestedData = d3.nest()
        .key(function(d) { return d.apartment_id})
        .rollup(function(v) {
          return {
            volume: d3.sum(v,function(d) { return d.volume; }),
            hot: d3.sum(v,function(d) { return d.hot; }),
            cold: d3.sum(v,function(d) { return d.cold; }),
            building_id: buildingId, //Not longer 1, 2 or 3
            apartment_id: v[0].apartment_id,
            apartment_size: parseInt(v[0].apartment_size)
          };
        })
        .entries(filteredDate)
        .filter(function(d){
          return d.key!=""&&d.key!="undefined";
        });

        filteredDate = [];
        nestedData.map(ba => filteredDate.push(ba.value))

        console.log(filteredDate)

        //Find apartment with highest and lowest water consumption
        // this.max = 0;
        // this.min = 20000;
        // this.max_hot = 0;
        // this.min_hot = 20000;
        // this.max_cold = 0;
        // this.min_cold = 20000;

        // this.max_apartment;
        // this.min_apartment;


        console.log(this.max)
        var _this = this;
        nestedData.forEach(function(d) {

          if (d.value.volume>_this.max){
            _this.max = d.value.volume;
            _this.max_apartment=d;
          }
          if (d.value.hot>_this.max_hot){
            _this.max_hot = d.value.hot;
          }
          if (d.value.cold>_this.max_cold){
            _this.max_cold = d.value.cold;
          }
          if (d.value.volume<_this.min){
            _this.min = d.value.volume;
            _this.min_apartment=d;
          }
          if (d.value.hot<_this.min_hot){
            _this.min_hot = d.value.hot;
          }
          if (d.value.cold<_this.min_cold){
            _this.min_cold = d.value.cold;
          }
        });
        //const {width} = this.state;
        this.width = 1000;
        this.radius_scale = d3.scaleSqrt().domain([this.min, this.max]).range([4, 30]);
        this.sort_scale = d3.scaleSqrt().domain([this.min, this.max]).range([this.width, 0]);
        this.sort_hot_scale = d3.scaleSqrt().domain([this.min_hot, this.max_hot]).range([this.width, 0]);
        this.sort_cold_scale = d3.scaleSqrt().domain([this.min_cold, this.max_cold]).range([this.width, 0]);
        //console.log(max_apartment.value.volume+" "+min_apartment.value.volume)
        console.log("hereeeee");
        console.log(filteredDate)
        //this.drawChart(filteredDate)
      }

      //   this.setState({
      //     radius_scale:radius_scale,
      //     sort_scale: sort_scale,
      //     sort_hot_scale: sort_hot_scale,
      //     sort_cold_scale: sort_cold_scale,
      //     apartments: nestedData,
      //     min: min,
      //     max: max,
      //     min_hot: min_hot,
      //     max_hot: max_hot,
      //     min_cold: min_cold,
      //     max_cold: max_cold })// _this.drawChart)
      //
      // }



      var labels = d3.select("#chart")
      .append("svg")
      .attr("id", "labels")
      .attr("height", 60)
      .attr("width", this.width)

      var svg = d3.select("#chart")
      .append("svg")
      .attr("height", this.height)
      .attr("width", this.width)
      .append("g")
      .attr("transform", "translate(0,0)")

      var tooltip = d3.select("#chart")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")

      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

      var showTooltip = function(d) {
        tooltip
        .transition()
        .duration(200)
        tooltip
        .style("opacity", 1)
        .html("Apartment: " + d.key + " Building: id "+ (d.value.building_id) + ", Rooms: "+ d.value.apartment_size + ", Water volume: " + d.value.volume+  ", Hot water: " + d.value.hot + ", Cold water "+ d.value.cold)
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

      var circles = svg.selectAll(".apartment_id")
      .data(nestedData)
      .enter().append("circle")
      .attr("class", "apartment")
      .attr("r", function(d){
        return _this.radius_scale(d.value.volume);
      })
      .attr("fill", function(d){
        var hot_percentage=Math.floor(d.value.hot/d.value.volume*100);
        var cold_percentage=100-hot_percentage;



        // Konstig data eller fel i rollup?
        // console.log(d.value.hot)
        // console.log(d.value.cold)
        // console.log(hot_percentage);
        // console.log(cold_percentage);
        var grad = svg.append("defs").append("linearGradient").attr("id", "grad"+d.key)
        .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
        grad.append("stop").attr("offset", cold_percentage+"%").style("stop-color", "#6095F9");
        grad.append("stop").attr("offset", cold_percentage+"%").style("stop-color", "#FF7675");
        return "url(#grad"+d.key+")"
      })
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseout", hideTooltip)

      //this.setState({circles: circles}, this.makeForces(nestedData));
      this.makeForces(nestedData, circles)


    }

  }


  makeForces(nestedData, circles) {
    //const {circles} = this.state;
    var _this = this;

    if(circles != null){
      var sim = d3.forceSimulation();



      var force_collide = d3.forceCollide(function(d) {
        return _this.radius_scale(d.value.volume) + 1;
      })

      sim
      .force("x", forceX_combine)
      .force("y", forceY)
      .force("collide", force_collide)

      sim.nodes(nestedData)
      .on('tick', tick)


      function tick() {
        circles
        .attr("cx", d => d.x = Math.max(_this.radius_scale(d.value.volume), Math.min(_this.width - _this.radius_scale(d.value.volume), d.x)))
        .attr("cy", d => d.y = Math.max(_this.radius_scale(d.value.volume), Math.min(_this.height - _this.radius_scale(d.value.volume), d.y)))
      }

      circles.call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))

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

    }

    var forceX_separate = d3.forceX(function(d) {
        if(d.value.building_id==0){
          return (_this.width/2)-(_this.width/3);
        }
        if(d.value.building_id==1){
          return _this.width/2;
        }
        if(d.value.building_id==2){
          console.log(d);
          return (_this.width/2)+(_this.width/3);
        }
      }).strength(0.05)

    var forceX_combine = d3.forceX(function(d) {
        return _this.width/2;
      }).strength(0.05)

    var forceY = d3.forceY(function(d) {
       return _this.height/2;
      }).strength(0.05)

    var forceX_separate_rooms = d3.forceX(function(d) {
      if(d.value.apartment_size==1){
        return 20;
      }
      if(d.value.apartment_size==2){
        return (_this.width/2)-(_this.width/6);
      }
      if(d.value.apartment_size==3){
        return (_this.width/2)+(_this.width/6);
      }
      if(d.value.apartment_size==4){
        return _this.width-20;
      }

      // if(d.value.apartment_size==1){
      //   return (WIDTH/2)-(WIDTH/3);
      // }
      // if(d.value.apartment_size==2){
      //   return (WIDTH/2)+(WIDTH/3);
      // }
      // if(d.value.apartment_size==3){
      //   return (WIDTH/2)-(WIDTH/3);
      // }
      // if(d.value.apartment_size==4){
      //   return (WIDTH/2)+(WIDTH/3);
      // }
      }).strength(0.05)

    var forceY_separate_rooms = d3.forceY(function(d) {
        // if(d.value.apartment_size==1){
        //   return (HEIGHT/2)-(HEIGHT/4);
        // }
        // if(d.value.apartment_size==2){
        //   return (HEIGHT/2)-(HEIGHT/4);
        // }
        // if(d.value.apartment_size==3){
        //   return (HEIGHT/2)+(HEIGHT/4);
        // }
        // if(d.value.apartment_size==4){
        //   return (HEIGHT/2)+(HEIGHT/4);
        // }
      }).strength(0.05)

  }




  // drawChart(filteredDate) {
  //   console.log(filteredDate)
  // //  nestedData.forEach(function(d) {return console.log(d.value)})
  //   //if(nestedData.size()!= 0){
  //   var labels = d3.select("#chart")
  //   .append("svg")
  //   .attr("id", "labels")
  //   .attr("height", 60)
  //   .attr("width", this.width)
  //
  //   //console.log("lables "+labels)
  //
  //   var svg = d3.select("#chart")
  //   .append("svg")
  //   .attr("height", this.height)
  //   .attr("width", this.width)
  //   .append("g")
  //   .attr("transform", "translate(0,0)")
  //
  //   var tooltip = d3.select("#chart")
  //   .append("div")
  //   .style("opacity", 0)
  //   .attr("class", "tooltip")
  //   .style("background-color", "black")
  //
  //   .style("border-radius", "5px")
  //   .style("padding", "10px")
  //   .style("color", "white")
  //

//}



render(){
  return(
    <div className="container-fluid">
    <div id="chart">
    <p>Bubblechart</p>
    </div>
    </div>
  )
}
}
