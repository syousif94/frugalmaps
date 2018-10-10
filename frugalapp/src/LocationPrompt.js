import React, { Component } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet
} from "react-native";
import { BLUE } from "./Colors";
import { Permissions } from "expo";
import { connect } from "react-redux";

import * as Location from "./store/location";

class LocationPrompt extends Component {
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
    const { status: locationStatus } = await Permissions.askAsync(
      Permissions.LOCATION
    );

    if (locationStatus !== "granted") {
      return;
    }

    this.props.coordinates();
    this._setButtonOpacity(0);
  };

  _setButtonOpacity = opacity => {
    Animated.timing(
      this.state.buttonOpacity,
      { duration: 150, toValue: opacity },
      { useNativeDriver: true }
    ).start();
  };

  _keyboardWillShow = async () => {
    const { status: locationStatus } = await Permissions.getAsync(
      Permissions.LOCATION
    );

    if (locationStatus !== "granted") {
      this._setButtonOpacity(1);
    }
  };

  _keyboardWillHide = () => {
    this._setButtonOpacity(0);
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
          <TouchableOpacity style={styles.btn} onPress={this._promptLocation}>
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

const mapDispatchToProps = {
  coordinates: Location.actions.coordinates
};

export default connect(
  null,
  mapDispatchToProps
)(LocationPrompt);

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
