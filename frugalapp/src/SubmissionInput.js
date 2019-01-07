import React, { Component } from "react";
import { TouchableOpacity, TextInput } from "react-native";

export default class SubmissionInput extends Component {
  state = {
    focused: false
  };

  _focus = () => {
    this._input.focus();
    this.setState({
      focused: true
    });
  };

  _onBlur = () => {
    this.setState({
      focused: false
    });
  };

  render() {
    const { containerStyle = {}, ...props } = this.props;
    const pointerEvents = this.state.focused ? "auto" : "none";
    return (
      <TouchableOpacity
        style={containerStyle}
        activeOpacity={1}
        onPress={this._focus}
        disabled={this.state.focused}
      >
        <TextInput
          pointerEvents={pointerEvents}
          ref={ref => (this._input = ref)}
          {...props}
          onBlur={this._onBlur}
        />
      </TouchableOpacity>
    );
  }
}
