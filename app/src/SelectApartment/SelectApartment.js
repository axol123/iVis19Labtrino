import React, { Component } from "react";
import "./SelectApartment.css";

export default class SelectApartment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			apartment: null,
			apartmentList: ["Apartment 1", "Apartment 2", "Apartment 3"]
		};
	}

	componentDidUpdate(prevProps) {
		if (this.props.data !== prevProps.data) {
			//console.log(this.props.data);

			this.processData();
		}
	}

	processData = () => {
		// Input data a building
		var data = this.props.data;
		console.log(data);

		// Save apartments with unique id:s
		var uniqueApartmentIds = [];

		data.map(
			record =>
				function() {
					console.log(record);
					var id = record[4];
					var filteredItem = uniqueApartmentIds.filter(listId => listId == id);
					if (filteredItem.length == 0) {
						uniqueApartmentIds.push(id);
					}
				//	console.log(uniqueApartmentIds);
				}
		);
	};

	updateApartment = e => {
		console.log(e.target);
	};

	render() {
		var apartmentList = this.state.apartmentList;
		var apartments = apartmentList.map(apartment => (
			<li key={apartment}>
				<div className="apartment-item" onClick={this.updateApartment}>
					{apartment}
				</div>
			</li>
		));
		return (
			<div className="col-2 p-0">
				<div className="apartment-list p-0">
					<h3 className="apartments-title">Apartments</h3>
					<br />
					<ul className="p-0 m-0">{apartments}</ul>
				</div>
			</div>
		);
	}
}
