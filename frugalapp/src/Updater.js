import React, { Component } from "react";
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Text,
  AppState
} from "react-native";
import { Updates } from "expo";
import { BLUE } from "./Colors";
import { DEV } from "./Constants";

export default class Updater extends Component {
  state = {
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(0),
    update: false
  };

  componentDidMount() {
    this._check().then(() => {
      AppState.addEventListener("change", this._handleAppStateChange);
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  componentDidUpdate(_, previous) {
    if (!previous.update && this.state.update) {
      this._fadeIn();
    }
  }

  _fadeIn = () => {
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        { duration: 300, toValue: 1 },
        { useNativeDriver: true }
      ),
      Animated.timing(
        this.state.translateY,
        { duration: 300, toValue: -20 },
        { useNativeDriver: true }
      )
    ]).start();
  };

  _appState = AppState.currentState;

  _handleAppStateChange = nextAppState => {
    if (
      this._appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this._check();
    }
    this._appState = nextAppState;
  };

  _check = async () => {
    if (DEV) {
      // setTimeout(() => {
      //   this.setState({
      //     update: true
      //   });
      // }, 3000);
      return;
    }
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        this.setState({
          update: true
        });
      }
    } catch (e) {
      alert(e.message);
    }
  };

  _update = () => {
    Updates.reloadFromCache();
  };

  render() {
    const { opacity, translateY, update } = this.state;

    const btnStyle = [
      styles.btnBG,
      {
        opacity,
        transform: [{ translateY }]
      }
    ];

    const pointerEvents = update ? "auto" : "none";
    return (
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View style={btnStyle} pointerEvents={pointerEvents}>
          <TouchableOpacity onPress={this._update} style={styles.btn}>
            <Text style={styles.text}>Update Available</Text>
            <Text style={styles.subText}>Tap to apply</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 100
  },
  btnBG: {
    height: 52,
    width: 190,
    borderRadius: 26,
    backgroundColor: BLUE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 1
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff"
  },
  subText: {
    marginTop: 2,
    fontSize: 12,
    color: "#fff"
  }
});
