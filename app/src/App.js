import React, { Component } from "react";
import ReactDOM from "react-dom";
import Fade from "react-reveal";
import About from "./About/About";

// App css
import "./App.css";

// React router
import { Route } from "react-router-dom";

// Components
import DetailView from "./DetailView/DetailView";
import SelectApartment from "./SelectApartment/SelectApartment";
import NavBar from "./NavBar/NavBar";

class App extends Component {
	constructor() {
		super();
		this.state = {
			loading: true
		};
	}

	componentDidMount() {
		// Time for loader animation
		setTimeout(() => this.setState({ loading: false }), 2000);
	}

	render() {
		// Loading status
		const { loading } = this.state;

		// Loader animation
		var loader = (
			<div className="container-fluid h-100">
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
				<NavBar />
				<div className="container-fluid full-height bg-light p-0">
					<div className="row">
						<div className="row placeholder p-0 m-0">
							<div className="col-6 mx-auto d-flex align-items-center">
								{/* <SelectApartment /> */}
								<h1 className="text-center mx-auto"> Map view </h1>
							</div>
						</div>
					</div>
					<DetailView />
				</div>
			</Fade>
		);

		// Change to app when loading is done
		var content = loading ? loader : app;

		return (
			<div className="App bg-light">
				<About />
				{content}
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));

export default App;
