import React, { Component } from "react";
import {
  Keyboard,
  View,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet
} from "react-native";
import { BLUE } from "./Colors";
import { Permissions } from "expo";

export default class LocationPrompt extends Component {
  state = {
    buttonOpacity: new Animated.Value(0)
  };

  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      this._keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      this._keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  _promptLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
  };

  _keyboardWillShow = async () => {
    const { status: locationStatus } = await Permissions.getAsync(
      Permissions.LOCATION
    );

    if (locationStatus !== "granted") {
      Animated.timing(
        this.state.buttonOpacity,
        { duration: 150, toValue: 1 },
        { useNativeDriver: true }
      ).start();
    }
  };

  _keyboardWillHide = () => {
    Animated.timing(
      this.state.buttonOpacity,
      { duration: 150, toValue: 0 },
      { useNativeDriver: true }
    ).start();
  };

  render() {
    const buttonStyle = [
      styles.btnContainer,
      {
        opacity: this.state.buttonOpacity
      }
    ];
    return (
      <KeyboardAvoidingView behavior="padding">
        <Animated.View style={buttonStyle}>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.title}>Enable Location Access</Text>
            <Text style={styles.subtitle}>
              Search is better with location access
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  btnContainer: {
    height: 44,
    backgroundColor: BLUE
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14
  },
  subtitle: {
    color: "#fff",
    fontSize: 12
  }
});
