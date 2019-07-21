import React, { Component } from "react";
import { TouchableOpacity, TextInput, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WEB } from "../utils/Constants";

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

  _clear = () => {
    this.props.onChangeText("");
    this._focus();
  };

  _renderClear = () => {
    if (!this.props.value || !this.props.value.length) return null;

    return (
      <View style={styles.clearWrap} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.clear}
          activeOpacity={1}
          onPress={this._clear}
        >
          <Ionicons name="md-close" size={14} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { containerStyle = {}, style, render, ...props } = this.props;
    const pointerEvents = this.state.focused ? "auto" : "none";

    if (WEB) {
      return (
        <View style={containerStyle}>
          {render ? render() : null}
          <input
            {...props}
            style={{
              border: "none",
              ...style,
              outline: "none",
              textDecoration: "none",
              appearance: "none",
              background: "transparent",
              fontSize: 14
            }}
          />
          {this._renderClear()}
        </View>
      );
    }

    return (
      <View style={containerStyle}>
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={1}
          onPress={this._focus}
          disabled={this.state.focused}
        >
          <TextInput
            pointerEvents={pointerEvents}
            ref={ref => (this._input = ref)}
            {...props}
            style={style}
            onBlur={this._onBlur}
          />
        </TouchableOpacity>
        {this._renderClear()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    flex: 1
  },
  clearWrap: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  clear: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 1,
    paddingLeft: 1,
    marginRight: 20
  }
});
