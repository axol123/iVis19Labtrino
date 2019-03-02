import React, { Component } from "react";
import ReactDOM from "react-dom";
import Fade from "react-reveal";

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
			<div class="container-fluid h-100">
				<div class="row h-100 justify-content-center  d-flex align-items-center">
					<div class="sk-cube-grid">
						<div class="sk-cube sk-cube1" />
						<div class="sk-cube sk-cube2" />
						<div class="sk-cube sk-cube3" />
						<div class="sk-cube sk-cube4" />
						<div class="sk-cube sk-cube5" />
						<div class="sk-cube sk-cube6" />
						<div class="sk-cube sk-cube7" />
						<div class="sk-cube sk-cube8" />
						<div class="sk-cube sk-cube9" />
					</div>
				</div>
			</div>
		);

		// App content
		var app = (
			<Fade>
				<NavBar />
				<div className="container-fluid full-height">
					<div className="row full-height">
						<SelectApartment />
						<DetailView />
					</div>
				</div>
				</Fade>
		);

		// Change to app when loading is done
		var content = loading ? loader : app;

		return <div className="App">{content}</div>;
	}
}

ReactDOM.render(<App />, document.getElementById("root"));

export default App;
