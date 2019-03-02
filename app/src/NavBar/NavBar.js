import React, {Component} from 'react';

import "./NavBar.css";

class NavBar extends Component {

	render(){
	    return(
	    	<nav className="navbar navbar-light bg-light justify-content-between">
			  <a className="navbar-brand">Labtrino</a>
			  <a className="nav-link" >About</a>
			</nav>
	    )
	}
}
export default NavBar;