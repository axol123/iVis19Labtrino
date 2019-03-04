import React, {Component} from 'react';

export default class SelectApartment extends Component {
	state = { tab : "rest" }
	
	render () {
    const { tab } = this.state;

    console.log(tab);

		return (
          <div id="bubbleButtons">
            <button id="combine" data-active={ tab == "rest" } onClick={ () => { this.setState({ tab : "reset" }); this.props.combine() } }>Reset</button>
            <button id="rooms" data-active={ tab == "rooms" } onClick={ () => { this.setState({ tab : "rooms" }); this.props.filterRooms() } }>Filter per rooms</button>
            <button id="sort_volume" data-active={ tab == "volume" } onClick={ () => { this.setState({ tab : "volume" }); this.props.sortVolume() } }>Sort water volume</button>
            <button id="sort_hot" data-active={ tab == "hot" } onClick={ () => { this.setState({ tab : "hot" }); this.props.sortVolumeHot() } }>Sort hot water volume</button>
            <button id="sort_cold" data-active={ tab == "cold" } onClick={ () => { this.setState({ tab : "cold" }); this.props.sortVolumeCold() } }>Sort cold water volume</button>
          </div>
		)
	}
}