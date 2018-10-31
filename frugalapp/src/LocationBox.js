import React, { Component } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import * as Location from "./store/location";
import emitter from "tiny-emitter/instance";
import moment from "moment";

class LocationBox extends Component {
  componentDidMount() {
    emitter.on("blur-location-box", this._blur);
  }

  componentWillUnmount() {
    emitter.off("blur-location-box", this._blur);
  }

  _blur = () => {
    this._input.blur();
  };

  _onLayout = e => {
    const {
      nativeEvent: {
        layout: { y, height }
      }
    } = e;

    const listTop = y + height + 10;

    this.props.set({
      listTop
    });
  };

  _onFocus = () => {
    this.props.set({
      focused: true
    });
  };

  _onBlur = () => {
    this.props.set({
      focused: false
    });
  };

  _onChangeText = text => {
    this.props.set({
      text
    });
  };

  render() {
    const { text, focused, refreshing, bounds } = this.props;

    let value = text;

    if (bounds) {
      const { northeast, southwest } = bounds;

      value = `${northeast.lat.toFixed(4)}, ${southwest.lng.toFixed(
        4
      )} to ${southwest.lat.toFixed(4)}, ${northeast.lng.toFixed(4)}`;
    }

    const today = moment();
    const date = today.format("MMM D, YYYY");
    const day = today.format("dddd");

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            {day}, {date}
          </Text>
        </View>
        <View style={styles.search} onLayout={this._onLayout}>
          <Entypo name="magnifying-glass" size={18} color="#000" />
          <TextInput
            ref={ref => (this._input = ref)}
            placeholder={refreshing ? "Locating..." : "Search cities..."}
            style={styles.input}
            placeholderTextColor="#333"
            returnKeyType="done"
            onChangeText={this._onChangeText}
            value={value}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            autoCapitalize="words"
            clearButtonMode={focused ? "always" : "never"}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  text: state.location.text,
  bounds: state.location.bounds,
  focused: state.location.focused,
  refreshing: state.events.refreshing
});

const mapDispatchToProps = {
  set: Location.actions.set
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationBox);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0"
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5
  },
  titleText: {
    fontWeight: "600",
    fontSize: 18,
    color: "#000"
  },
  search: {
    margin: 10,
    backgroundColor: "#ededed",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12
  },
  input: {
    height: 44,
    fontSize: 16,
    paddingLeft: 10,
    flex: 1,
    marginRight: 12
  }
});
