import React, { Component } from "react";

const Context = React.createContext();

class LocationUI extends Component {
  state = {
    listTop: null,
    focused: false
  };

  set = state => {
    this.setState(state);
  };

  render() {
    return (
      <Context.Provider
        value={{
          listTop: this.state.listTop,
          focused: this.state.focused,
          set: this.set
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

const Consumer = Context.Consumer;

export { Consumer };

export default LocationUI;
