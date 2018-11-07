import React, { Component } from "react";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Linking,
  Alert,
  AppState
} from "react-native";
import { BLUE } from "./Colors";
import { Permissions } from "expo";
import { connect } from "react-redux";

import * as Location from "./store/location";

class LocationPrompt extends Component {
  state = {
    buttonOpacity: new Animated.Value(0),
    hidden: true
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
    const { status: askStatus } = await Permissions.getAsync(
      Permissions.LOCATION
    );

    if (askStatus === "denied") {
      Alert.alert(
        "Permission Denied",
        "To enable location, tap Open Settings, then tap on Location, and finally tap on While Using the App.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              this._appState = AppState.currentState;
              AppState.addEventListener("change", this._handleAppStateChange);
              Linking.openURL("app-settings:");
            }
          }
        ]
      );
    }

    const { status: locationStatus } = await Permissions.askAsync(
      Permissions.LOCATION
    );

    if (locationStatus !== "granted") {
      return;
    }

    this.props.coordinates();
    this._setButtonOpacity(0);
  };

  _handleAppStateChange = async nextAppState => {
    if (
      this._appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      const { status: locationStatus } = await Permissions.getAsync(
        Permissions.LOCATION
      );

      if (locationStatus === "granted") {
        this.props.coordinates();
        this._setButtonOpacity(0);
      }

      AppState.removeEventListener("change", this._handleAppStateChange);
    }

    this._appState = nextAppState;
  };

  _setButtonOpacity = opacity => {
    if (opacity === 1) {
      this.setState({
        hidden: false
      });
    }
    Animated.timing(
      this.state.buttonOpacity,
      { duration: 150, toValue: opacity },
      { useNativeDriver: true }
    ).start(() => {
      if (opacity === 0) {
        this.setState({
          hidden: true
        });
      }
    });
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
    if (this.state.hidden) {
      return null;
    }

    const buttonStyle = [
      styles.btnContainer,
      {
        opacity: this.state.buttonOpacity
      }
    ];

    return (
      <Animated.View style={buttonStyle}>
        <TouchableOpacity style={styles.btn} onPress={this._promptLocation}>
          <Text style={styles.title}>Enable Location Access</Text>
          <Text style={styles.subtitle}>
            Search is better with location access
          </Text>
        </TouchableOpacity>
      </Animated.View>
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
