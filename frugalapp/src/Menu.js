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
import SearchBar from "./SearchBar";
import SearchSuggestions from "./SearchSuggestions";

export default class Menu extends PureComponent {
  state = {
    searching: false,
    visible: false,
    opacity: new Animated.Value(0)
  };

  componentDidMount() {
    emitter.on("show-menu", this._showMenu);
    emitter.on("toggle-search", this._toggleSearch);
    emitter.on("info-pop", this._onInfoPop);
  }

  componentWillUnmount() {
    emitter.off("show-menu", this._showMenu);
    emitter.off("toggle-search", this._toggleSearch);
    emitter.off("info-pop", this._onInfoPop);
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

    if (this.state.visible && prev.searching !== this.state.searching) {
      const toValue = this.state.searching ? 2 : 1;
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

  _toggleSearch = searching => {
    this.setState({
      searching
    });
  };

  _dismiss = () => {
    this.setState({
      visible: false,
      searching: false
    });
  };

  _setSearchRef = ref => {
    this._search = ref;
  };

  _onInfoPop = () => {
    if (this.state.searching) {
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

    const translateY = this.state.opacity.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [HEIGHT * 0.4 + 40, HEIGHT * 0.4, 0],
      extrapolate: "clamp"
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
          <SearchBar ref={this._setSearchRef} />
          <CalendarDayPicker />
          <SubmitButton />
          <SearchSuggestions
            opacity={this.state.opacity}
            searching={this.state.searching}
          />
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
    height: HEIGHT * 0.9,
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  }
});
