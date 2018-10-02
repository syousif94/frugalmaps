import React, { Component } from "react";
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
    refreshing: false,
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
      const hits = res.hits;

      const data = Events.initial();

      hits.every(hit => {
        hit._source.days.forEach(day => {
          data[day].data.push(hit);
        });
      });

      this.setState({
        refreshing: false,
        data
      });
    } catch (error) {
      console.log(error);
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
