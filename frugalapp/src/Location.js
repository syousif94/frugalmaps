import React, { Component } from "react";
import { Permissions, Location } from "expo";

const Context = React.createContext();

class LocationProvider extends Component {
  state = {
    location: null
  };

  componentDidMount() {
    this.getLocation();
  }

  getLocation = async () => {
    const { status: locationStatus } = await Permissions.getAsync(
      Permissions.LOCATION
    );

    if (locationStatus !== "granted") {
      return;
    }

    const {
      coords: { latitude, longitude }
    } = await Location.getCurrentPositionAsync({
      enableHighAccuracy: false
    });

    this.setState({
      location: {
        latitude,
        longitude
      }
    });
  };

  render() {
    return (
      <Context.Provider
        value={{
          location: this.state.location,
          getLocation: this.getLocation
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

const Consumer = Context.Consumer;

export { Consumer };

export default LocationProvider;
