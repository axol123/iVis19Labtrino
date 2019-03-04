import React, { Component } from "react";
import ReactDOM from "react-dom";
import Fade from "react-reveal";
import About from "./About/About";

// App css
import "./App.css";

// React router
import { Route } from "react-router-dom";

// Components
import MapView from "./MapView/MapView";
import DetailView from "./DetailView/DetailView";
import NavBar from "./NavBar/NavBar";

class App extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			selectedBuilding: null,
			selectedApartment: null,
		};
	}

	mapViewOnLoad = () => this.setState({ loading: false })

	setSelectedBuilding = id => {
		this.setState({ selectedBuilding: id, selectedApartment : null }, window.scrollTo(0, 0));
	}

	setSelectedApartment = id => {
		this.setState({ selectedApartment: id }, window.scrollTo(0, 0));
	}

	render() {
		// Loading status
		const { loading, selectedBuilding } = this.state;


		//Some charts crash if building has not been selected
		let detailView = selectedBuilding ? <DetailView buildingid={this.state.selectedBuilding} apartmentid={this.state.selectedApartment} /> : null;

		// Loader animation
		var loader = (
			<div className="loader-container container-fluid h-100" data-loading={ loading }>
				<div className="row h-100 justify-content-center  d-flex align-items-center">
					<div className="sk-cube-grid">
						<div className="sk-cube sk-cube1" />
						<div className="sk-cube sk-cube2" />
						<div className="sk-cube sk-cube3" />
						<div className="sk-cube sk-cube4" />
						<div className="sk-cube sk-cube5" />
						<div className="sk-cube sk-cube6" />
						<div className="sk-cube sk-cube7" />
						<div className="sk-cube sk-cube8" />
						<div className="sk-cube sk-cube9" />
					</div>
				</div>
			</div>
		);

		// App content
		var app = (
			<Fade>
				<div className="top-section-container">
					<NavBar />
					<MapView setSelectedBuilding={ this.setSelectedBuilding } setSelectedApartment={ this.setSelectedApartment } onLoad={ this.mapViewOnLoad } />
				</div>

				<div className="container-fluid bg-light p-0">{ detailView }</div>
			</Fade>
		);

		// Change to app when loading is done

		return (
			<div className="App bg-light" data-building-selected={ !!this.state.selectedBuilding }>
		        { loader }

				<About />

				{ app }
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));

export default App;
