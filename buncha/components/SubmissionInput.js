import React, { Component } from "react";
import { TouchableOpacity, TextInput, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WEB } from "../utils/Constants";
import { BLUE } from "../utils/Colors";

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
    const {
      containerStyle = {},
      style,
      render,
      onChangeText,
      ...props
    } = this.props;
    const { focused } = this.state;
    const pointerEvents = focused ? "auto" : "none";

    if (WEB) {
      return (
        <View
          style={[
            containerStyle,
            {
              backgroundColor: focused ? "#fff" : "#f4f4f4",
              borderWidth: 1,
              borderColor: focused ? BLUE : "#f4f4f4"
            }
          ]}
        >
          {render ? render() : null}
          <input
            {...props}
            style={{
              border: "none",
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
            onChangeText={onChangeText || null}
            style={style}
            onBlur={this._onBlur}
            placeholderTextColor="rgba(0,0,0,0.5)"
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
