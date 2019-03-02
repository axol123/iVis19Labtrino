import React, { Component } from "react";
import ReactDOM from 'react-dom';
import logo from "./logo.svg";
import "./App.css";
import { Route } from 'react-router-dom';
import DetailView from "./DetailView/DetailView";
import SelectApartment from "./SelectApartment/SelectApartment";
import NavBar from "./NavBar/NavBar";


class App extends Component {
	constructor() {
		super()
		this.state = {
	    loading: true
	  }
	}

  componentDidMount() {
    // this simulates an async action, after which the component will render the content
    demoAsyncCall().then(() => setTimeout(() => this.setState({ loading: false }), 100000));
  }
  
  render() {
    const { loading } = this.state;
    
    if(loading) { // if your component doesn't have to wait for async data, remove this block 
      return null; // render null when app is not ready
    }
    
    return (
      <div className="App">
				<NavBar/>
				<div className="container-fluid full-height">
					<div className="row full-height">
						<SelectApartment />
						<DetailView />
					</div>
				</div>
			</div>
    ); 
  }
}

function demoAsyncCall() {
  return new Promise((resolve) => setTimeout(() => resolve(), 2500));
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);



export default App;
