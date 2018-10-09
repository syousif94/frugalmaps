import React, { Component } from "react";
import { Alert } from "react-native";
import _ from "lodash";
import api from "./API";

const Context = React.createContext();

class Events extends Component {
  static days = ["S", "M", "T", "W", "Th", "F", "Sa"];
  static initial = () => [
    { title: "Sunday", data: [] },
    { title: "Monday", data: [] },
    { title: "Tuesday", data: [] },
    { title: "Wednesday", data: [] },
    { title: "Thursday", data: [] },
    { title: "Friday", data: [] },
    { title: "Saturday", data: [] }
  ];

  state = {
    refreshing: true,
    data: Events.initial()
  };

  async componentDidMount() {
    await this.fetch();
  }

  fetch = async () => {
    try {
      this.setState({
        refreshing: true
      });
      const res = await api("query-events");
      const text = res.text;
      const hits = res.hits;

      const allDays = Events.initial();

      hits.every(hit => {
        hit._source.days.forEach(day => {
          allDays[day].data.push(hit);
        });
      });

      const data = allDays.filter(day => day.data.length);

      this.setState({
        refreshing: false,
        data
      });
    } catch (error) {
      this.setState({
        refreshing: false
      });
      Alert.alert("Something Went Wrong", error);
    }
  };
  render() {
    return (
      <Context.Provider
        value={{
          refreshing: this.state.refreshing,
          data: this.state.data,
          fetch: this.fetch
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}
const Consumer = Context.Consumer;

export { Consumer };

export default Events;
