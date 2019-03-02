import React, {Component} from 'react';
import ApartmentInfo from '../ApartmentInfo/ApartmentInfo';
import LineChart from '../Charts/LineChart';
import BubbleChart from '../Charts/BubbleChart';
import GraphChart from '../Charts/GraphChart';
import LineChartWarmColdWater from '../Charts/LineChartWarmColdWater';
import PieChart from "../PieChart/PieChart";
import data from "../master.json";

//D3 v5
import * as d3 from "d3";

class DetailView extends Component {
  constructor() {
		super();
		this.state = {
			startDate: "2019-01-21",
			stopDate: "2019-01-25",
			timeOption: "month"
		};
	}


  componentDidMount() {
   // this.readData(this.props.data);

  }

//Waiting for new props from parent component
  /*componentDidUpdate(prevProps){
    if (this.props.data !== prevProps.data) {
      this.readData(this.props.data);
    }
  }*/

  readData = obj => {
    this.setState({data: obj})
  }


  updateDates = e => {
		var newDate = e.target.value;
		console.log("Line chart updated");
		console.log(newDate);

		if (e.target.id == "start") {
			console.log(newDate);
			this.setState({ startDate: newDate } );
		} else if (e.target.id == "stop") {
			console.log(newDate);
			this.setState({ stopDate: newDate });
		}
	};

  render(){
    return(
      <div className="col-10 p-0">
    <div className="detailView header">
    <p>Start</p>
				<input
					type="date"
					id="start"
					value={this.state.startDate}
					onChange={this.updateDates}
				/>
				<p>Stop</p>
				<input
					type="date"
					id="stop"
					value={this.state.stopDate}
					onChange={this.updateDates}
				/>
      <p> Details</p>
      <PieChart />
      <ApartmentInfo data={this.props.data}/>
     {/* <LineChart data={this.props.data}/> */}
      <LineChartWarmColdWater startDate={this.state.startDate} stopDate={this.state.stopDate} />
      <BubbleChart data={this.props.data}/>
      <GraphChart />
    </div>
    </div>

  );
}

}

export default DetailView;
