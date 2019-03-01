import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import DetailView from "./DetailView/DetailView";
import GraphChart from "./Charts/GraphChart";
import SelectApartment from "./SelectApartment/SelectApartment";
//import csv from '../master.csv';

import * as firebase from "firebase";

class App extends Component {
	constructor() {
		super();
		this.state = {
			selectedBuilding: null,
			selectedApartment: null,
			//dataOfSelectedBuilding: null,
		};

		// Connect to firebase database
		//this.database = firebase.database();
	}

	componentDidMount = () => {
		this.readData()
	};

	readData = obj => {
		this.setState({selectedBuilding: "52b41c98-ab21-4ad5-828b-74069bcd55e7" });
	};

// 	updateApartment = e => {
// 		var newApartment = e.target.value;
// 		//console.log("Line chart updated");
// 		console.log(newApartment);
// 		//this.setState({selectedBuilding: newApartment})
// 		// if (e.target.id == "start") {
// 		// 	console.log(newDate);
// 		// 	this.setState({ startDate: newDate } );
// 		// } else if (e.target.id == "stop") {
// 		// 	console.log(newDate);
// 		// 	this.setState({ stopDate: newDate });
// 		// }
// };

	render() {
		return (
			<div className="App">
				<div className="container-fluid full-height">
					<div className="row full-height">
						<SelectApartment />
						<DetailView buildingid={this.state.selectedBuilding} />
					</div>
				</div>
			</div>
		);
	}
}

export default App;
