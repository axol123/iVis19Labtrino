import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
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

		buildingMaster.on("value", this.readData);
		master.on("value", this.readData);
	};

	readData = obj => {
		var array = [];
		console.log(obj.val());
		if (this.state.data !== null) {
      array.push(this.state.data);
      array.push(obj.val());
    }
    else{
      array = obj.val()
    }

		console.log(array);

		// Store firebase data in state
		this.setState({ data: array });
	};

	render() {
		console.log(this.state.data);

		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>
						Edit <code>src/App.js</code> and save to reload.
					</p>
					<a
						className="App-link"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn React
					</a>
				</header>
			</div>
		);
	}
}

export default App;
