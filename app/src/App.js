import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import DetailView from "./DetailView/DetailView";
import GraphChart from "./Charts/GraphChart";
import SelectApartment from "./SelectApartment/SelectApartment";

import * as firebase from "firebase";

class App extends Component {
	constructor() {
		super();
		this.state = {
			data: null
		};

		// Connect to firebase database
		this.database = firebase.database();
	}

	componentDidMount = () => {
		// Ref to database trees
		var buildingMaster = this.database.ref("BuildingMasterSheet");
		var master = this.database.ref("masterSheet");
		var building1 = this.database.ref("building_1");
		var building2 = this.database.ref("building_2");
		var building3 = this.database.ref("building_3");

		//Examples of accessing all data from a specific apartment

		//Get value from Building1 where apartmentid = f58b8069-a2f5-4e2e-b8c2-a2bfb7fd642b

		building1
			.orderByChild("5")
			.equalTo("f58b8069-a2f5-4e2e-b8c2-a2bfb7fd642b")
			.on("value", this.readData);

		// //Get value from Building2 where apartmentid = 5585bb8d-6e5d-4f01-91c0-b73632b6e2b0
		// building2.orderByChild("5")
		// .equalTo("5585bb8d-6e5d-4f01-91c0-b73632b6e2b0")
		// .on("value", this.readData)
		//
		// //Get value from Building1 where apartmentid =
		// building3.orderByChild("5")
		// .equalTo("1cfa2f8f-ec5d-46da-a62a-ad2ba6be2058")
		// .on("value", this.readData)
	};

	readData = obj => {
		var array = [];
		console.log(obj.val());
		array.push(obj.val());
		this.setState({ data: obj.val() });
	};

	render() {
		return (
			<div className="App">
				<div className="container-fluid full-height">
					<div className="row full-height">
						<SelectApartment />
						<DetailView data={this.state.data} />
					</div>
				</div>
			</div>
		);
	}
}

export default App;
