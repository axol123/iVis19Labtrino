import React, {Component} from 'react';
import BubbleButtons from './BubbleButtons'
import "./BubbleChart.css";
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
    this.height = 500;
    this.wait_buildings = false;
    this.wait_apartments = false;
    this.wait_volume = false;
    this.wait_hot = false;
    this.wait_cold = false;
    this.wait_combine = false;
    this.sim = false;
    this.force_collide = false;
    this.forceX_separate = false;
    this.forceX_combine = false;
    this.forceY = false;
    this.forceX_separate_rooms = false;
    this.forceY_separate_rooms = false;
    this.radius_scale = false;
    this.sort_scale = false;
    this.sort_hot_scale = false;
    this.sort_cold_scale = false;
    this.should_highlight = true;

    this.$labelContainer = null;
    this.$chartContainer = null;
    
  }

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate = (newProps) => {
    if(this.prevProps !== newProps) {
      d3.select(this.$labelContainer).selectAll("*").remove();
      d3.select(this.$chartContainer).selectAll("*").remove();
     
      this.should_highlight=true;
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
      var apartmentId = this.should_highlight ? this.props.apartmentID: null;

      if(this.props.buildingID != null) {
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

        //console.log("Data ")
        console.log(filteredDate)

        //Find apartment with highest and lowest water consumption
        this.max = 0;
        this.min = 20000;
        this.max_hot = 0;
        this.min_hot = 20000;
        this.max_cold = 0;
        this.min_cold = 20000;

        // this.max_apartment;
        // this.min_apartment;

        console.log("max är!")
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
        this.width = Number(d3.select(this.$chartContainer).style("width").slice(0, -2));
        this.radius_scale = d3.scaleSqrt().domain([this.min, this.max]).range([4, 30]);
        this.sort_scale = d3.scaleSqrt().domain([this.min, this.max]).range([this.width, 0]);
        this.sort_hot_scale = d3.scaleSqrt().domain([this.min_hot, this.max_hot]).range([this.width, 0]);
        this.sort_cold_scale = d3.scaleSqrt().domain([this.min_cold, this.max_cold]).range([this.width, 0]);
      }

      if(apartmentId != null) {
        var labels = d3.select(this.$labelContainer)
        .append("svg")
        .attr("id", "labels")
        .attr("height", 60)
        .attr("width", this.width)

        var svg = d3.select(this.$chartContainer)
        .append("svg")
        .attr("height", this.height)
        .attr("width", this.width)
        .append("g")
        .attr("transform", "translate(0,0)")

        var tooltip = d3.select(this.$chartContainer)
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#000")
        .style("pointer-events", "none");;

        var circles = svg.selectAll(".apartment_id")
        .data(nestedData)
        .enter().append("circle")
        .attr("class", "apartment")
        .attr("r", function(d){
          return _this.radius_scale(d.value.volume);
        })
        .attr("fill", function(d){
          if(d.value.apartment_id != apartmentId){
            var hot_percentage=Math.floor(d.value.hot/d.value.volume*100);
            var cold_percentage=100-hot_percentage;
            var grad = svg.append("defs").append("linearGradient").attr("id", "grad"+d.key)
            .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
            grad.append("stop").attr("offset", cold_percentage+"%").style("stop-color", "#b7cdf7");
            grad.append("stop").attr("offset", cold_percentage+"%").style("stop-color", "#f9b6b6");
            return "url(#grad"+d.key+")"
          }
          else{
            var hot_percentage=Math.floor(d.value.hot/d.value.volume*100);
            var cold_percentage=100-hot_percentage;
            var grad = svg.append("defs").append("linearGradient").attr("id", "grad"+d.key)
            .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
            grad.append("stop").attr("offset", cold_percentage+"%").style("stop-color", "#6095F9");
            grad.append("stop").attr("offset", cold_percentage+"%").style("stop-color", "#FF7675");
            return "url(#grad"+d.key+")"
          }
        })
        .on("mouseover", mouseover)
        .on("mousemove", function(){return tooltip.style("top", `${ parseInt(d3.select(this).attr("cy")) }px`).style("left",`${ parseInt(d3.select(this).attr("cx")) }px`)})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})

      } else {

        var labels = d3.select(this.$labelContainer)
        .append("svg")
        .attr("id", "labels")
        .attr("height", 60)
        .attr("width", this.width)

        var svg = d3.select(this.$chartContainer)
        .append("svg")
        .attr("height", this.height)
        .attr("width", this.width)
        .append("g")
        .attr("transform", "translate(0,0)")

        var tooltip = d3.select(this.$chartContainer)
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#000")
        .style("pointer-events", "none");

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
          var grad = svg.append("defs").append("linearGradient").attr("id", "grad"+d.key)
          .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
          grad.append("stop").attr("offset", cold_percentage+"%").style("stop-color", "#6095F9");
          grad.append("stop").attr("offset", cold_percentage+"%").style("stop-color", "#FF7675");
          return "url(#grad"+d.key+")"
        })
        .on("mouseover", mouseover)
        .on("mousemove", function(){return tooltip.style("top", `${ parseInt(d3.select(this).attr("cy")) }px`).style("left",`${ parseInt(d3.select(this).attr("cx")) }px`)})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
      }

      function mouseover(d) {
        tooltip.text("Apartment: " + d.key 
          + " Building: id "+ (d.value.building_id) 
          + ", Rooms: "+ d.value.apartment_size 
          + ", Water volume: " + Math.round(d.value.volume)
          +  ", Hot water: " + Math.round(d.value.hot) 
          + ", Cold water "+ Math.round(d.value.cold))
        .style("font-size","15px")
        .style("background-color","#C4C6CC")
        .style("padding", "10pt")
        .style("color","#7F87A0")
        .style("border-radius","5px")
        .style( "box-shadow", "1px 1px 20px #a7a4a4"); 

        return tooltip.style("visibility", "visible");
      }

      this.makeForces(nestedData, circles)
    }
  }


  makeForces(nestedData, circles) {
    var _this = this;

    if(circles != null) {
      this.sim = d3.forceSimulation();


      this.force_collide = d3.forceCollide(function(d) {
        return _this.radius_scale(d.value.volume) + 1;
      })

      this.forceX_separate = d3.forceX(function(d) {
        // if(d.value.building_id==0){
        //   return (1000/2)-(500/3);
        // }
        // if(d.value.building_id==1){
        //   return _this.width/2;
        // }
        // if(d.value.building_id==2){
        //   console.log(d);
        //   return (_this.width/2)+(_this.width/3);
        // }
      }).strength(0.05)

      this.forceX_combine = d3.forceX(function(d) {
          return _this.width/2;
        }).strength(0.05)

      this.forceY = d3.forceY(function(d) {
         return _this.height/2;
       }).strength(0.05)

      this.forceX_separate_rooms = d3.forceX(function(d) {
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

      this.forceY_separate_rooms = d3.forceY(function(d) {
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

      this.sim
      .force("x", this.forceX_combine)
      .force("y", this.forceY)
      .force("collide", this.force_collide)

      this.sim.nodes(nestedData)
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
        if (!d3.event.active) _this.sim.alphaTarget(0.003).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d){
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d){
        if (!d3.event.active) _this.sim.alphaTarget(0).restart();
        d.fx = null;
        d.fy = null;
      }
    }
  }

  filter_rooms = e => {
    var _this = this;

    this.wait_apartments=true;
    this.wait_combine = false;
    this.wait_volume=false;
    this.wait_hot=false;
    this.wait_cold=false;

    var labelsvg = d3.select(this.$labelContainer).select("#labels")

    labelsvg
      .selectAll("text")
      .remove()

    // labelsvg
    //   .append("text").text("Apertments sorted per number of rooms").attr("y", 20).attr("x", this.width/2).style("text-anchor", "middle")

    labelsvg
      .append("text").text("1 room").attr("y", 50).attr("x", 20)

    labelsvg
      .append("text").text("2 rooms").attr("y", 50).attr("x", (this.width/2)-(this.width/6)-30)

    labelsvg
      .append("text").text("3 rooms").attr("y", 50).attr("x", (this.width/2)+(this.width/6)-30)

    labelsvg
      .append("text").text("4 rooms").attr("y", 50).attr("x", this.width-80)

      this.wait_apartments = true;

    this.sim
      .force("x", this.forceX_separate_rooms.strength(0.1))
      .force("y", this.forceY.strength(0.01))
      .alphaTarget(0.4)
      .restart()

      setTimeout(function() {
        //var {wait_apartments} = _this.state;
        if(_this.wait_apartments){
          _this.sim
            .alphaTarget(0)
            .restart()
          }
       }, 3000);
       //this.wait_apartments = false;
  }

  sort_volume = e => {
    //const {sim, sort_scale, min, max, width}=this.state;
    var _this = this;

    this.wait_apartments=false;
    this.wait_combine = false;
    this.wait_volume=true;
    this.wait_hot=false;
    this.wait_cold=false;

    //this.setState({wait_buildings: false, wait_apartments: false, wait_combine: false, wait_volume: true, wait_hot: false, wait_cold: false});

    var labelsvg = d3.select(this.$labelContainer).select("#labels")

    labelsvg
      .selectAll("text")
      .remove()

    // labelsvg
    //   .append("text").text("Descending sorted water volume").attr("y", 20).attr("x", this.width/2).style("text-anchor", "middle")

    labelsvg
      .append("text").text(Math.round(this.max)+ " liters").attr("y", 50).attr("x", 0)

    labelsvg
      .append("text").text(Math.round(this.min)+ " liters").attr("y", 50).attr("x", this.width-100)

    this.sim
      .force("x", d3.forceX(function(d) {
        return _this.sort_scale(d.value.volume);
      }).strength(0.1))
      .force("y", this.forceY.strength(0.01))
      .alphaTarget(0.5)
      .restart()

      setTimeout(function() {
        //var {wait_volume} = _this.state;
        if(_this.wait_volume){
          _this.sim
            .alphaTarget(0)
            .restart()
          }
       }, 3000);
       //this.wait_volume = false;
  }

  sort_volume_hot = e => {
    //const {sim, sort_hot_scale, min_hot, max_hot, width}=this.state;

    var _this = this;

    this.wait_apartments=false;
    this.wait_combine = false;
    this.wait_volume=false;
    this.wait_hot=true;
    this.wait_cold=false;

    //this.setState({wait_buildings: false, wait_apartments: false, wait_combine: false, wait_volume: false, wait_hot: true, wait_cold: false});

    var labelsvg = d3.select(this.$labelContainer).select("#labels")

    labelsvg
      .selectAll("text")
      .remove()

    // labelsvg
    //   .append("text").text("Descending sorted hot water volume").attr("y", 20).attr("x", this.width/2).style("text-anchor", "middle")

    labelsvg
      .append("text").text(Math.round(this.max_hot)+ " liters").attr("y", 50).attr("x", 0)

    labelsvg
      .append("text").text(Math.round(this.min_hot)+ " liters").attr("y", 50).attr("x", this.width-100)

    this.sim
      .force("x", d3.forceX(function(d) {
        return _this.sort_hot_scale(d.value.hot);
      }).strength(0.1))
      .force("y", this.forceY.strength(0.01))
      .alphaTarget(0.5)
      .restart()

      setTimeout(function() {
        //var {wait_hot} = _this.state;
        if(_this.wait_hot){
          _this.sim
            .alphaTarget(0)
            .restart()
          }
       }, 3000);
       //this.wait_hot = false;
  }

  sort_volume_cold = e => {
    //const {sim, sort_cold_scale, min_cold, max_cold, width}=this.state;
    var _this = this;

    this.wait_apartments=false;
    this.wait_combine = false;
    this.wait_volume=false;
    this.wait_hot=false;
    this.wait_cold=true;

    //this.setState({wait_buildings: false, wait_apartments: false, wait_combine: false, wait_volume: false, wait_hot: false, wait_cold: true});

    var labelsvg = d3.select(this.$labelContainer).select("#labels")

    labelsvg
      .selectAll("text")
      .remove()

    // labelsvg
    //   .append("text").text("Descending sorted cold water volume").attr("y", 20).attr("x", this.width/2).style("text-anchor", "middle")

    labelsvg
      .append("text").text(Math.round(this.max_cold)+ " liters").attr("y", 50).attr("x", 0)

    labelsvg
      .append("text").text(Math.round(this.min_cold)+ " liters").attr("y", 50).attr("x", this.width-100)

    this.sim
      .force("x", d3.forceX(function(d) {
        return _this.sort_cold_scale(d.value.cold);
      }).strength(0.1))
      .force("y", this.forceY.strength(0.01))
      .alphaTarget(0.5)
      .restart()

      setTimeout(function() {
        //var {wait_cold} = _this.state;
        if(_this.wait_cold){
          _this.sim
            .alphaTarget(0)
            .restart()
          }
       }, 3000);
         //this.wait_cold = false;
  }

  combine = e => {
    d3.select(this.$labelContainer).selectAll("*").remove();
    d3.select(this.$chartContainer).selectAll("*").remove();
    //  if(newProps !== prevProps){
    this.should_highlight=false;
    this.drawChart();

    // var _this = this;

    // this.wait_apartments=true;
    // this.wait_combine = false;
    // this.wait_volume=false;
    // this.wait_hot=false;
    // this.wait_cold=false;

    // d3.select(this.$labelContainer).selectAll("*").remove();

    // this.sim
    //   .force("x", this.forceX_combine)
    //   .force("y", this.forceY)
    //   .force("collide", this.force_collide)
    //   .restart()

    //   setTimeout(function() {
    //     //var {wait_apartments} = _this.state;
    //     if(_this.wait_apartments){
    //       _this.sim
    //         .alphaTarget(0)
    //         .restart()
    //       }
    //    }, 3000);
       //this.wait_apartments = false;
  }





  render() {
    return (
      <div id="bubble-chart">
        <header>
          <h2>Consumption Breakdown</h2>

          <BubbleButtons combine={this.combine} filterRooms={this.filter_rooms} sortVolume={this.sort_volume} sortVolumeHot={this.sort_volume_hot} sortVolumeCold={this.sort_volume_cold} />
        </header>

        <div className="label-container" ref={ element => this.$labelContainer = element }>
        </div>

        <div className="chart-container" ref={ element => this.$chartContainer = element }>
        </div>

        
      </div>
    )
  }
}
