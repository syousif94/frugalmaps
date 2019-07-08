import React, { PureComponent } from "react";
import {
  Animated,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput
} from "react-native";
import emitter from "tiny-emitter/instance";
import { HEIGHT } from "./Constants";
import { ANDROID } from "./Constants";
import CityPicker from "./CalendarCityPicker";

export default class Menu extends PureComponent {
  state = {
    visible: false,
    opacity: new Animated.Value(0)
  };

  componentDidMount() {
    emitter.on("toggle-menu", this._toggleMenu);
    emitter.on("toggle-search", this._toggleSearch);
    emitter.on("info-pop", this._onInfoPop);
    if (ANDROID) {
      this.keyboardWillHideListener = Keyboard.addListener(
        "keyboardDidHide",
        this._keyboardWillHide
      );
    }
  }

  _keyboardWillHide = () => {
    if (ANDROID) {
      TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField());
      this._dismiss();
    }
  };

  componentWillUnmount() {
    emitter.off("toggle-search", this._toggleSearch);
    emitter.off("info-pop", this._onInfoPop);
    if (ANDROID) {
      this.keyboardWillHideListener.remove();
    }
  }

  componentDidUpdate(prev) {
    if (prev.visible !== this.state.visible) {
      const toValue = this.state.visible ? 1 : 0;
      Animated.timing(
        this.state.opacity,
        { toValue, duration: 250 },
        { useNativeDriver: true }
      ).start();
    }
  }

  _toggleMenu = visible => {
    this.setState({
      visible
    });
  };

  _toggleSearch = visible => {
    this.setState({
      visible
    });
    if (visible) {
      this._search.getWrappedInstance().focus();
    }
  };

  _dismiss = () => {
    this.setState({
      visible: false
    });
  };

  _setSearchRef = ref => {
    this._search = ref;
  };

  _onInfoPop = () => {
    if (this.state.visible) {
      this._search.getWrappedInstance().focus();
    }
  };

  render() {
    const opacity = this.state.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp"
    });

    const containerStyle = [
      styles.container,
      {
        opacity
      }
    ];

    const pointerEvents = this.state.visible ? "auto" : "none";

    return (
      <Animated.View style={containerStyle} pointerEvents={pointerEvents}>
        <TouchableWithoutFeedback onPress={this._dismiss}>
          <View style={styles.bg} />
        </TouchableWithoutFeedback>
        <CityPicker />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    elevation: 6
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.96)"
  }
});
