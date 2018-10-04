import React, { Component } from "react";
import _ from "lodash";
import api from "./API";

const Context = React.createContext();

import { Consumer as LocationConsumer } from "./Location";

class LocationResults extends Component {
  state = {
    refreshing: false,
    data: [],
    suggested: [],
    value: ""
  };

  constructor(props) {
    super(props);

    this._fetchData = _.throttle(async text => {
      try {
        let query = `input=${text}&types=(cities)`;

        if (this.props.location) {
          const { longitude, latitude } = this.props.location;
          const locationQuery = `&location=${latitude},${longitude}&radius=10000`;
          query = `${query}${locationQuery}`;
        }

        const res = await api("places/suggest", {
          query
        });

        if (this.props.value === "") {
          return;
        }

        this.setState({
          data: res.values
        });
      } catch (error) {
        console.log(error);
      }
    }, 50);
  }

  onChangeText = value => {
    this.setState({
      value
    });

    this._fetch(value);
  };

  _fetch = text => {
    if (text !== undefined) {
      this._fetchData(text);
    } else {
      this._fetchSuggested();
    }
  };

  _fetchSuggested = async () => {};

  render() {
    return (
      <Context.Provider
        value={{
          refreshing: this.state.refreshing,
          data: this.state.data,
          suggested: this.state.suggested,
          value: this.state.value,
          onChangeText: this.onChangeText
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

const Consumer = Context.Consumer;

export default ({ children }) => (
  <LocationConsumer>
    {({ location }) => (
      <LocationResults location={location}>{children}</LocationResults>
    )}
  </LocationConsumer>
);

export { Consumer };
