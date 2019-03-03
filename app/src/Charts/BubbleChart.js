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
      d3.select("#chart").selectAll("*").remove();
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
        this.width = 1000;
        this.radius_scale = d3.scaleSqrt().domain([this.min, this.max]).range([4, 30]);
        this.sort_scale = d3.scaleSqrt().domain([this.min, this.max]).range([this.width, 0]);
        this.sort_hot_scale = d3.scaleSqrt().domain([this.min_hot, this.max_hot]).range([this.width, 0]);
        this.sort_cold_scale = d3.scaleSqrt().domain([this.min_cold, this.max_cold]).range([this.width, 0]);
      }

      if(apartmentId != null){
        var labels = d3.select("#chart")
        .append("g")
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
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#000");

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
        .on("mouseover", function(d){tooltip.text("Apartment: " + d.key + " Building: id "+ (d.value.building_id) + ", Rooms: "+ d.value.apartment_size + ", Water volume: " + d.value.volume+  ", Hot water: " + d.value.hot + ", Cold water "+ d.value.cold).style("font-size","15px").style("background-color","#C4C6CC").style("padding", "10pt").style("color","#7F87A0").style("border-radius","5px").style( "box-shadow", "1px 1px 20px #a7a4a4"); return tooltip.style("visibility", "visible");})
        .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-20)+"px").style("left",(d3.event.pageX-200)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})

      }
      else{
        var labels = d3.select("#chart")
        .append("g")
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
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#000");

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
        .on("mouseover", function(d){tooltip.text("Apartment: " + d.key + " Building: id "+ (d.value.building_id) + ", Rooms: "+ d.value.apartment_size + ", Water volume: " + d.value.volume+  ", Hot water: " + d.value.hot + ", Cold water "+ d.value.cold).style("font-size","15px").style("background-color","#C4C6CC").style("padding", "10pt").style("color","#7F87A0").style("border-radius","5px").style( "box-shadow", "1px 1px 20px #a7a4a4"); return tooltip.style("visibility", "visible");})
        .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-20)+"px").style("left",(d3.event.pageX-200)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})

        //this.setState({circles: circles}, this.makeForces(nestedData));

    }
    this.makeForces(nestedData, circles)

    }

  }


  makeForces(nestedData, circles) {
    //const {circles} = this.state;
    var _this = this;

    if(circles != null){
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

      this.wait_buildings = true;

      this.sim
        .force("x", this.forceX_combine)
        .force("y", this.forceY.strength(0.05))
        .alphaTarget(0.3)
        .restart()

        setTimeout(function() {
          if(this.wait_buildings){
            _this.sim
              .alphaTarget(0)
              .restart()
            }
         }, 3000);
           this.wait_buildings = false;

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

filter_rooms = e => {
  var _this = this;
  var labelsvg = d3.select("#chart").select("#labels")
  this.wait_apartments = true;

  labelsvg
    .selectAll("text")
    .remove()

  labelsvg
    .append("text").text("Apertments sorted per number of rooms").attr("y", 20).attr("x", this.width/2).style("text-anchor", "middle")

  labelsvg
    .append("text").text("1").attr("y", 50).attr("x", 20)

  labelsvg
    .append("text").text("2").attr("y", 50).attr("x", (this.width/2)-(this.width/6))

  labelsvg
    .append("text").text("3").attr("y", 50).attr("x", (this.width/2)+(this.width/6))

  labelsvg
    .append("text").text("4").attr("y", 50).attr("x", this.width-20)

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
     this.wait_apartments = false;
}
sort_volume = e => {
  //const {sim, sort_scale, min, max, width}=this.state;
  var _this = this;

  this.wait_volume = true;

  //this.setState({wait_buildings: false, wait_apartments: false, wait_combine: false, wait_volume: true, wait_hot: false, wait_cold: false});

  var labelsvg = d3.select("#chart").select("#labels")

  labelsvg
    .selectAll("text")
    .remove()

  labelsvg
    .append("text").text("Descending sorted water volume").attr("y", 20).attr("x", this.width/2).style("text-anchor", "middle")

  labelsvg
    .append("text").text(Math.round(this.max * 100) / 100).attr("y", 50).attr("x", 0)

  labelsvg
    .append("text").text(Math.round(this.min * 100) / 100).attr("y", 50).attr("x", this.width-100)

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
     this.wait_volume = false;
}
sort_volume_hot = e => {
  //const {sim, sort_hot_scale, min_hot, max_hot, width}=this.state;
  var _this = this;


  this.wait_hot = true;
  //this.setState({wait_buildings: false, wait_apartments: false, wait_combine: false, wait_volume: false, wait_hot: true, wait_cold: false});

  var labelsvg = d3.select("#chart").select("#labels")

  labelsvg
    .selectAll("text")
    .remove()

  labelsvg
    .append("text").text("Descending sorted hot water volume").attr("y", 20).attr("x", this.width/2).style("text-anchor", "middle")

  labelsvg
    .append("text").text(Math.round(this.max_hot * 100) / 100).attr("y", 50).attr("x", 0)

  labelsvg
    .append("text").text(Math.round(this.min_hot * 100) / 100).attr("y", 50).attr("x", this.width-100)

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
     this.wait_hot = false;
}

sort_volume_cold = e => {
  //const {sim, sort_cold_scale, min_cold, max_cold, width}=this.state;
  var _this = this;

  this.wait_cold = true;

  //this.setState({wait_buildings: false, wait_apartments: false, wait_combine: false, wait_volume: false, wait_hot: false, wait_cold: true});

  var labelsvg = d3.select("#chart").select("#labels")

  labelsvg
    .selectAll("text")
    .remove()

  labelsvg
    .append("text").text("Descending sorted cold water volume").attr("y", 20).attr("x", this.width/2).style("text-anchor", "middle")

  labelsvg
    .append("text").text(Math.round(this.max_cold * 100) / 100).attr("y", 50).attr("x", 0)

  labelsvg
    .append("text").text(Math.round(this.min_cold * 100) / 100).attr("y", 50).attr("x", this.width-100)

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
       this.wait_cold = false;
}
combine = e => {

  //const {sim}=this.state;
  var _this = this;
  this.wait_combine = true;

  var labelsvg = d3.select("#chart").select("#labels")

  labelsvg
    .selectAll("text")
    .remove()


  //this.setState({wait_buildings: false, wait_apartments: false, wait_combine: true, wait_volume: false, wait_hot: false, wait_cold: false});
  this.sim
    .force("x", this.forceX_combine)
    .force("y", this.forceY.strength(0.05))
    .alphaTarget(0.3)
    .restart()

    setTimeout(function() {
      //var {wait_combine} = _this.state;
      if(_this.wait_combine){
        _this.sim
          .alphaTarget(0)
          .restart()
        }
     }, 300);

     this.wait_combine = false;

}






render(){
  // <button id="combine" onClick={this.combine}>combine</button>
  // <button id="sort_volume" onClick={this.sort_volume}>Sort water volume</button>
  // <button id="sort_hot" onClick={this.sort_volume_hot}>Sort hot water volume</button>
  // <button id="sort_cold" onClick={this.sort_volume_cold}>Sort cold water volume</button>
  return(
    <div className="container-fluid">
    <p>Bubblechart</p>
    <div id="bubbleButtons">
      <button id="combine" onClick={this.combine}>Reset</button>

      <button id="rooms" onClick={this.filter_rooms}>Filter per rooms</button>
      <button id="sort_volume" onClick={this.sort_volume}>Sort water volume</button>
      <button id="sort_hot" onClick={this.sort_volume_hot}>Sort hot water volume</button>
      <button id="sort_cold" onClick={this.sort_volume_cold}>Sort cold water volume</button>

    </div>
    <div id="chart"></div>
    </div>
  )
}
}
