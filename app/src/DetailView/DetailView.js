import React, {Component} from 'react';
import ApartmentInfo from '../ApartmentInfo/ApartmentInfo';
import LineChart from '../Charts/LineChart';
import BubbleChart from '../Charts/BubbleChart';
import GraphChart from '../Charts/GraphChart';

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
    console.log(this.props.data)
    this.setState({data: this.props.data})
  }

  render(){
          //<LineChart data={this.props.data}/>
    return(
    <div className="col-10 p-0">
      <div className="detailView header">
        <ApartmentInfo data={this.props.data}/>

        <BubbleChart />
        <GraphChart />
      </div>
    </div>

  );
}

}

export default DetailView;
