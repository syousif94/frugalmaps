import React, { Component } from "react";
import { TouchableOpacity, TextInput, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WEB, IOS_WEB } from "../utils/Constants";
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

  _onFocus = () => {
    this.setState({
      focused: true
    });
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  };

  _onBlur = () => {
    this.setState({
      focused: false
    });
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  _clear = () => {
    requestAnimationFrame(() => {
      this.props.onChangeText("");
    });

    // this._focus();
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
      backgroundColor = "#f4f4f4",
      returnKeyType = null,
      ...props
    } = this.props;
    const { focused } = this.state;
    const pointerEvents = focused ? "auto" : "none";

    const container = [
      styles.inputContainer,
      containerStyle,
      {
        backgroundColor: focused ? "#fff" : backgroundColor,
        borderWidth: 1,
        borderColor: focused ? BLUE : "rgba(0,0,0,0)"
      }
    ];

    if (WEB) {
      return (
        <View style={container}>
          {render ? (
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => {
                requestAnimationFrame(() => {
                  this._input.focus();
                });
              }}
            >
              {render()}
            </TouchableOpacity>
          ) : null}
          <input
            ref={ref => (this._input = ref)}
            {...props}
            style={{
              border: "none",
              ...StyleSheet.flatten(styles.input),
              outline: "none",
              textDecoration: "none",
              appearance: "none",
              background: "transparent",
              fontSize: 14,
              ...StyleSheet.flatten(style),
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif'
            }}
            onFocus={this._onFocus}
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
            returnKeyType={returnKeyType}
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
    padding: 0,
    margin: 0,
    paddingLeft: 10,
    flex: 1
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
    overflow: "hidden"
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
    paddingTop: IOS_WEB ? null : 1.5,
    paddingLeft: 0.5,
    marginRight: 20
  }
});
