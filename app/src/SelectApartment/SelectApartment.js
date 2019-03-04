import React, { Component } from "react";
import "./SelectApartment.css";

export default class SelectApartment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			apartment: null,
			apartmentList: [],
		};
	}

	//////PROPS FROM PARENT ////////
	//info = {this.state.buildingInfo}
	componentDidMount() {


			this.processData();

	}

	componentDidUpdate(prevProps) {
		if (this.props.info !== prevProps.info) {
			//console.log(this.props.data);

			this.processData();
		}
	}

	processData = () => {
		console.log("his is props"+this.props.info);
		if(this.props.info !== null){

			// Input data a building

			var data = this.props.info;
		//	console.log(data);

		//console.log(data.apartments_id)
		console.log(data)
		console.log(data.cold)

		var list = data.apartments_id.values();
		this.setState({apartmentList: list}, this.updateApartmentList)

			// Save apartments with unique id:s
			var uniqueApartmentIds = [];

			// data.map(function(d) { return console.log(d)
			// 	record =>
			// 		function() {
			// 			console.log(record);
			// 			var id = record[4];
			// 			var filteredItem = uniqueApartmentIds.filter(listId => listId == id);
			// 			if (filteredItem.length == 0) {
			// 				uniqueApartmentIds.push(id);
			// 			}
			// 		//	console.log(uniqueApartmentIds);
			// 		}
			// );
			//})


		}
	};

	updateApartmentList(){

	}


	render() {
		var apartmentList = this.state.apartmentList;
		var apartments = apartmentList.map(apartment => (
			<li key={apartment}>
				<div className="apartment-item" id={apartment} onClick={this.props.updateApartment}>
					{apartment}
				</div>
			</li>
		));
		return (
			<div className="col-2 p-0">
				<div className="apartment-list p-0">
					<h3 className="apartments-title">Apartments</h3>
					<br />
					<ul className=".apartment-item p-0 m-0" >{apartments}</ul>
				</div>
			</div>
		);
	}
}