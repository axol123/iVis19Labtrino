import React, {Component} from 'react';
import "./PieChart.css";

//D3 v5
import * as d3 from "d3";

export default class PieChart extends Component {
  componentDidMount = () => {
    this.drawChart();
  }

  componentDidUpdate = (newProps) => {
    if(this.prevProps !== newProps){
      d3.select("#pie-chart .chart-container").selectAll("*").remove();
      this.drawChart();
    }
  }

  drawChart() {
    var filteredDate =[];

    if(this.props.validData != null) {

      var buildingId = this.props.buildingID;
      var apartmentId = this.props.apartmentID;

      if(this.props.apartmentID != null) {
        var filterData = this.props.validData.map(da =>
          da.value.data.filter(function(d){
            return d.apartment_id === apartmentId
          })
        )
        filterData.map(ba => ba.forEach(function(d){return filteredDate.push(d)}))

        var nestedData = d3.nest()
        .key(function(d) { return d.apartment_id})
        .rollup(function(v) {
          return {
            //Is now once a day
            //timestamp_hour: v[0].timestamp_hour,
            apartment_id: v[0].apartment_id,
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

      } else {

        var filterData = this.props.validData.map(da =>
          da.value.data.filter(function(d){
            return d.building_id === buildingId
          })
        )

        filterData.map(ba => ba.forEach(function(d){return filteredDate.push(d)}))

        var nestedData = d3.nest()
        .key(function(d) { return d.building_id})
        .rollup(function(v) {
          return {
            //Is now once a day
            //timestamp_hour: v[0].timestamp_hour,
            building_id: v[0].building_id,
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

      //////////////////////////////////////////////
      if(filteredDate.length != 0) {
        var width = 960,
        height = 800,
        margin = 40,
        viewBox="0 0 960 500",
        perserveAspectRatio="xMinYMid"

        var radius = Math.min(width, height) / 2 - margin


        var data = [filteredDate[0].hot, filteredDate[0].cold]
        var total = Math.floor(filteredDate[0].volume);

        var color = d3.scaleOrdinal()
        .domain(data)
        .range(["#FF7675", "#6095F9"])

        var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(200);

        var pie = d3.pie();

        var svg = d3.select("#pie-chart .chart-container").append("svg")
        .datum(data)
        .attr("width", width)
        .attr("height", height)
        .call(responsivefy)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Text in the center of the pie chart
        svg.append("text")
        .attr("text-anchor", "middle")
        .attr('font-size', '32pt')
        //.attr('y', 20)
        .text(total + " liters");

        var arcs = svg.selectAll("g.arc")
        .data(pie)
        .enter().append("g")
        .attr("class", "arc")
        .on("mouseover",function(d,i){if(i == 0){
          tooltip.text('Hot water: ' + Math.floor(data[i]) + '\n' + 'liters').style("font-size","15px").style("background-color",color(i)).style("padding", "10pt").style("border-radius","5px").style("color","#fff").style( "box-shadow", "1px 1px 20px #a7a4a4"); return tooltip.style("visibility", "visible");
              
        }else{
          tooltip.text('Cold water: ' + Math.floor(data[i]) + '\n' + 'liters').style("font-size","15px").style("background-color",color(i)).style("padding", "10pt").style("border-radius","5px").style("color","#fff").style( "box-shadow", "1px 1px 20px #a7a4a4"); return tooltip.style("visibility", "visible");}
        }  )
  
        .on("mousemove", function(){return tooltip.style("top", `${ parseInt(d3.select(this).attr("cy")) }px`).style("left",`${ parseInt(d3.select(this).attr("cx")+70) }px`)})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

        arcs.append("path")
        .attr("fill", function(d, i) { return color(i); })
        .transition()
        .ease(d3.easeCircleIn)
        .duration(2000)
        .attrTween("d", tweenPie);

        var tooltip = d3.select("#pie-chart .chart-container")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#000")
        .text("a simple tooltip");

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
    }
  }

  render() {
    return (
      <div id="pie-chart">
        <header>
          <h2> Overall Consumption</h2>
        </header>

        <div className="m-0" className="chart-container"></div>

        <div className="px-5 w-100">
          <table className="w-100">
            <tbody>
              <tr>
                <td>
                  <div className="d-flex flex-row align-items-center">
                    <div className="box red"></div>
                    <p className="pl-4 m-0">Hot water</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex flex-row align-items-center">
                    <div className="box blue"></div>
                    <p className="pl-4 m-0">Cold water</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
