import React, { Component } from "react";
import ApartmentInfo from "../ApartmentInfo/ApartmentInfo";
import LineChart from "../Charts/LineChart";
import BubbleChart from "../Charts/BubbleChart";
import GraphChart from "../Charts/GraphChart";
import LineChartWarmColdWater from "../Charts/LineChartWarmColdWater";
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
		this.setState({ data: obj });
	};

	updateDates = e => {
		var newDate = e.target.value;
		console.log("Line chart updated");
		console.log(newDate);

		if (e.target.id == "start") {
			console.log(newDate);
			this.setState({ startDate: newDate });
		} else if (e.target.id == "stop") {
			console.log(newDate);
			this.setState({ stopDate: newDate });
		}
	};

	render() {
		return (
			<div className="p-0">
				<div className="detailView text-dark bg-light">
					<div className="bg-white full-width py-3">
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
					</div>
				</div>
				<div className="container full-height mx-auto">
					<div className="row py-4">
						<h3 className="text-center mx-auto"> Details</h3>
						<div className="row py-5">
							<div className="col-7 m-3 p-3 bg-white">
								<LineChartWarmColdWater
									startDate={this.state.startDate}
									stopDate={this.state.stopDate}
								/>
							</div>
							<div className="col-4 m-3 p-3 bg-white">
								<PieChart />
							</div>
						</div>
						<ApartmentInfo data={this.props.data} />
						{/* <LineChart data={this.props.data}/> */}

						<BubbleChart data={this.props.data} />
						{/* <GraphChart /> */}
					</div>
				</div>
			</div>
		);
	}
}

export default DetailView;
