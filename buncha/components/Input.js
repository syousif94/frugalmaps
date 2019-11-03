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

  _renderClear = multiline => {
    if (!this.props.value || !this.props.value.length) return null;

    const style = [styles.clear];
    if (multiline) {
      style.push({
        height: 40
      });
    } else {
      style.push({
        bottom: 0
      });
    }

    return (
      <TouchableOpacity style={style} onPress={this._clear}>
        <Ionicons name="ios-close-circle" size={18} color="rgba(0,0,0,0.4)" />
      </TouchableOpacity>
    );
  };

  _onChange = e => {
    this.props.onChangeText(e.target.value);
  };

  _onKeyPress = e => {
    const keycode = e.keyCode ? e.keyCode : e.which;
    if (this.props.blurOnSubmit && keycode === 13) {
      this._input.blur();
    }
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
      name,
      multiline,
      blurOnSubmit,
      autoCorrect,
      spellCheck,
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
      const correct = autoCorrect === false ? "off" : null;
      const checkSpelling = spellCheck === false ? "false" : null;
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
          {multiline ? (
            <textarea
              ref={ref => (this._input = ref)}
              {...props}
              name={name}
              style={{
                resize: "none",
                border: "none",
                ...StyleSheet.flatten(styles.input),
                outline: "none",
                textDecoration: "none",
                appearance: "none",
                background: "transparent",
                fontSize: 14,
                height: 100,
                ...StyleSheet.flatten(style),
                paddingTop: 12,
                fontFamily:
                  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif'
              }}
              onFocus={this._onFocus}
              onBlur={this._onBlur}
              onChange={this._onChange}
              onKeyPress={this._onKeyPress}
              autoCorrect={correct}
              spellCheck={checkSpelling}
            ></textarea>
          ) : (
            <input
              ref={ref => (this._input = ref)}
              {...props}
              name={name}
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
              onChange={this._onChange}
              onKeyPress={this._onKeyPress}
              autoCorrect={correct}
              spellCheck={checkSpelling}
            />
          )}

          {this._renderClear(multiline)}
        </View>
      );
    }

    const inputStyle = [styles.input];

    if (multiline) {
      inputStyle.push({
        height: 100,
        paddingTop: 12,
        textAlignVertical: "top"
      });
    }
    if (style) {
      inputStyle.push(style);
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
            style={inputStyle}
            onBlur={this._onBlur}
            placeholderTextColor="rgba(0,0,0,0.5)"
            autoCompleteType={autoCompleteType}
            multiline={multiline}
            blurOnSubmit={blurOnSubmit}
            autoCorrect={autoCorrect}
          />
        </TouchableOpacity>
        {this._renderClear(multiline)}
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
  clear: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center"
  }
});
