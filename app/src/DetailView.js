import React, {Component} from 'react';
import ApartmentInfo from './ApartmentInfo';
import LineChart from './LineChart';
import BubbleChart from './BubbleChart';

//D3 v5
import * as d3 from "d3";

class DetailView extends Component {

  componentDidMount() {
    this.readData(this.props.data);

  }

//Waiting for new props from parent component
  componentDidUpdate(prevProps){
    if (this.props.data !== prevProps.data) {
      this.readData(this.props.data);
    }
  }

  readData = obj => {
    this.setState({data: this.props.data})
  }

  render(){
    return(
    <div className="detailView">
      <p> Details</p>
      <ApartmentInfo data={this.props.data}/>
      <LineChart data={this.props.data}/>
      <BubbleChart data={this.props.data}/>
    </div>

  );
}

}

export default DetailView;
