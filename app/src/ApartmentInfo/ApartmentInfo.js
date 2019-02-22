import React, {Component} from 'react';
import "./ApartmentInfo.css";
//D3 v5
import * as d3 from "d3";

class ApartmentInfo extends Component {

  componentDidMount() {
     this.drawChart();

  }

//Waiting for new props from parent component
  componentDidUpdate(prevProps){
    if (this.props.data !== prevProps.data) {
      //this.setState({data: this.props.data})
      this.drawChart();
    }
  }

  drawChart() {

    if(this.props.data != null){
      console.log(this.props.data);

      // const data = this.props.data["10"];
      // console.log(data);
      var apartment_id

        const a = d3.select(".apartmentInfo").append("a").attr("width", 1000).attr("height", 300);
        var g = a.selectAll("g")
        .data(Object.values(this.props.data))
        .enter()
        .append("g")
        .attr("x", function(d){return d});

      const apartment = d3.nest()
      .key(function(d) {
        apartment_id = d[5]
        console.log(d[5])
        return d;
      })
      .entries(Object.values(this.props.data));

      console.log(JSON.stringify(apartment));
      console.log(apartment_id)
    //  this.setState({data: apartment_id})
      //console.log(this.state.apartment)

    }
  }

  getApartmentData(){

  }

  render(){
    return(
    <div className="apartmentInfo header">
    <p> ApartmentInfo </p>
    </div>
  )}

}

export default ApartmentInfo;
