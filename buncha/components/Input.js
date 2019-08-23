import React, { Component } from "react";
import { TouchableOpacity, TextInput, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WEB } from "../utils/Constants";
import { BLUE } from "../utils/Colors";

export default class Input extends Component {
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
    const {
      style = {},
      render,
      onChangeText,
      autoCompleteType,
      containerStyle = {},
      ...props
    } = this.props;
    const { focused } = this.state;
    const pointerEvents = focused ? "auto" : "none";

    const container = [
      styles.inputContainer,
      containerStyle,
      {
        backgroundColor: focused ? "#fff" : "#f4f4f4",
        borderWidth: 1,
        borderColor: focused ? BLUE : "#f4f4f4"
      }
    ];

    if (WEB) {
      return (
        <View style={container}>
          {render ? render() : null}
          <input
            ref={ref => (this._input = ref)}
            {...props}
            style={{
              border: "none",
              ...StyleSheet.flatten(styles.input),
              ...StyleSheet.flatten(style),
              outline: "none",
              textDecoration: "none",
              appearance: "none",
              background: "transparent",
              fontSize: 14
            }}
            onFocus={() => {
              this.setState({
                focused: true
              });
            }}
            onBlur={this._onBlur}
            onChange={e => {
              onChangeText(e.target.value);
            }}
          />
          {this._renderClear()}
        </View>
      );
    }

    return (
      <View style={container}>
        <TouchableOpacity
          style={styles.btn}
          onPress={this._focus}
          disabled={this.state.focused}
          activeOpacity={1}
        >
          {render ? render() : null}
          <TextInput
            pointerEvents={pointerEvents}
            ref={ref => (this._input = ref)}
            {...props}
            onChangeText={onChangeText || null}
            style={[styles.input, style]}
            onBlur={this._onBlur}
            placeholderTextColor="rgba(0,0,0,0.5)"
            autoCompleteType={autoCompleteType}
          />
        </TouchableOpacity>
        {this._renderClear()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: "row"
  },
  input: {
    height: 44,
    paddingLeft: 10,
    flex: 1
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    borderRadius: 5
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
    paddingTop: 1.5,
    paddingLeft: 0.5,
    marginRight: 20
  }
});
