import React, { PureComponent } from "react";
import {
  Animated,
  StyleSheet,
  View,
  TouchableWithoutFeedback
} from "react-native";
import emitter from "tiny-emitter/instance";
import { HEIGHT } from "./Constants";
import CalendarDayPicker from "./CalendarDayPicker";
import SubmitButton from "./SubmitButton";

export default class Menu extends PureComponent {
  state = {
    visible: false,
    opacity: new Animated.Value(0)
  };

  componentDidMount() {
    emitter.on("show-menu", this._showMenu);
  }

  componentWillUnmount() {
    emitter.off("show-menu", this._showMenu);
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

  _showMenu = () => {
    this.setState({
      visible: true
    });
  };

  _dismiss = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const containerStyle = [
      styles.container,
      {
        opacity: this.state.opacity
      }
    ];

    const translateY = this.state.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [40, 0]
    });

    const menuStyle = [
      styles.menu,
      {
        transform: [{ translateY }]
      }
    ];

    const pointerEvents = this.state.visible ? "auto" : "none";

    return (
      <Animated.View style={containerStyle} pointerEvents={pointerEvents}>
        <TouchableWithoutFeedback onPress={this._dismiss}>
          <View style={styles.bg} />
        </TouchableWithoutFeedback>
        <Animated.View style={menuStyle}>
          <CalendarDayPicker />
          <SubmitButton />
        </Animated.View>
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
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  menu: {
    height: HEIGHT * 0.5,
    backgroundColor: "#fff"
  }
});
