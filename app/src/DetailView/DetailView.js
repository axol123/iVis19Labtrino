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

		if (e.target.id === "start") {
			console.log(newDate);
			this.setState({ startDate: newDate });
		} else if (e.target.id === "stop") {
			console.log(newDate);
			this.setState({ stopDate: newDate });
		}
	};

	render() {
		return (
			<div className="p-0">
				<div className="detailView text-dark bg-light">
					{/* Datepicker */}
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

				{/* Detail view charts and info */}
				<div className="container full-height mx-auto">
					{/* Header */}
					<div className="row py-4">
						<h3 className="text-center mx-auto">Details</h3>
					</div>

					{/* Row linechart and piechart */}
					<div className="row py-3 ">
						{/* Linechart */}
						<div className="col-md-8 p-2 bg-white">
							<h1 className="justify-content-center d-flex align-items-center placeholder-text">
								Linechart
							</h1>
							{/*<LineChartWarmColdWater
								startDate={this.state.startDate}
								stopDate={this.state.stopDate}
							/>*/}
						</div>

						{/* Piechart */}
						<div className="col-md-4 pr-0 pl-md-3 pl-0 my-3 my-md-0">
						<div className="col-12 bg-white h-100">
							<h1 className="justify-content-center d-flex align-items-center placeholder-text">
								Piechart
							</h1>
							{/* <PieChart /> */}
						</div>
						</div>
					</div>

					{/* Row bubblechart */}
					<div className="row">
						{/* Bubblechart */}
						<div className="col-md-12 p-2 bg-white">
							{/* <BubbleChart data={this.props.data} /> */}
							<h1 className="justify-content-center d-flex align-items-center placeholder-text">
								BubbleChart
							</h1>
						</div>
					</div>
						
					{/* Apartment info*/}
					{/*
						<div className="col-12 bg-white">
						<ApartmentInfo data={this.props.data} />
						</div>
						 */}
				</div>
			</div>
		);
	}
}

export default DetailView;
