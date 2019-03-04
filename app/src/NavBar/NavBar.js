import React, { Component } from "react";
import logo from "../assets/logo_labtrino.png";
import "./NavBar.css";

class NavBar extends Component {
	render() {
		return (
			<nav className="navbar navbar-light bg-light justify-content-between">
				<div className="container">
					<div className="navbar-brand">
						<img src={logo} height="50" alt="Labtrino" />
					</div>
					
					<p className="about-link m-0 font-weight-bold" data-toggle="modal" data-target="#aboutModal">About</p>
				</div>
			</nav>
		);
	}
}
export default NavBar;
