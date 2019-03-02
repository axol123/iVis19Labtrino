import React, {Component} from 'react';
import logo from '../assets/logo_labtrino.png';

import "./NavBar.css";

class NavBar extends Component {

	render(){
	    return(
	    	<nav className="navbar navbar-light bg-light justify-content-between">
			  <a className="navbar-brand"><img src={logo} height="50" alt="Labtrino" /></a>
			  <a className="nav-link" >About</a>
			</nav>
	    )
	}
}
export default NavBar;