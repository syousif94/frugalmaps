import React, { Component } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import moment from "moment";
import MonoText from "./MonoText";

import { connect } from "react-redux";
import * as Location from "./store/location";
import emitter from "tiny-emitter/instance";
import { SafeArea as Container, ANDROID } from "./Constants";
import { RED } from "./Colors";

class LocationBox extends Component {
  constructor(props) {
    super(props);
    const time = moment();
    this.state = {
      now: time.format("h:mm:ss"),
      meridian: time.format(" a")
    };
  }

  componentDidMount() {
    emitter.on("focus-location-box", this._focus);
    emitter.on("blur-location-box", this._blur);
    this._interval = setInterval(() => {
      const time = moment();
      this.setState({
        now: time.format("h:mm:ss"),
        meridian: time.format(" a")
      });
    }, 500);
  }

  componentWillUnmount() {
    emitter.off("focus-location-box", this._focus);
    emitter.off("blur-location-box", this._blur);
    clearInterval(this._interval);
  }

  _focus = id => {
    if (id === this.props.id) {
      this._input.focus();
    }
  };

  _blur = id => {
    if (id === this.props.id) {
      this._input.blur();
    }
  };

  _onLayout = e => {
    const {
      nativeEvent: {
        layout: { y, height }
      }
    } = e;

    const listTop = y + height;

    this.props.set({
      listTop
    });
  };

  _onFocus = () => {
    this.props.set({
      focused: true,
      text: ""
    });
  };

  _onBlur = () => {
    this.props.set({
      focused: false
    });
  };

  _onChangeText = text => {
    const showCompletions = text.length > this.props.text.length;
    this.props.set({
      text
    });
    if (showCompletions) {
      emitter.emit("show-completions");
    }
  };

  _resetToLast = () => {
    this.props.set({
      text: this.props.lastQuery
    });
  };

  _renderQueryType = () => {
    const { queryType, focused } = this.props;

    if (!queryType || focused) {
      return null;
    }

    const bg = {
      backgroundColor: "#6C7B80"
    };
    return (
      <View style={styles.queryTypeBox}>
        <View style={[styles.queryType, bg]}>
          <Text style={styles.queryTypeText}>{queryType}</Text>
        </View>
      </View>
    );
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

    const today = moment().format("dddd, MMM Do Y");

    return (
      <Container style={styles.container}>
        <View style={styles.search}>
          <View style={styles.searchLine}>
            <Entypo name="magnifying-glass" size={18} color="#000" />
            <TextInput
              ref={ref => (this._input = ref)}
              placeholder={
                refreshing
                  ? "Locating..."
                  : "Search events, venues, descriptions..."
              }
              style={styles.input}
              placeholderTextColor="#333"
              returnKeyType="done"
              onChangeText={this._onChangeText}
              value={value}
              onFocus={this._onFocus}
              onBlur={this._onBlur}
              autoCapitalize="words"
              clearButtonMode={focused ? "always" : "never"}
              underlineColorAndroid="transparent"
              autoCorrect={ANDROID}
              onSubmitEditing={this._resetToLast}
              clearTextOnFocus
            />
          </View>
          {this._renderQueryType()}
        </View>
        <View style={styles.time} onLayout={this._onLayout}>
          <Text style={styles.relativeText}>{today}</Text>
          <MonoText
            text={this.state.now}
            textStyle={styles.relativeText}
            suffix={this.state.meridian}
          />
        </View>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  text: state.location.text,
  lastQuery: state.location.lastQuery,
  bounds: state.location.bounds,
  focused: state.location.focused,
  refreshing: state.events.refreshing,
  queryType: state.events.queryType
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
    backgroundColor: "#fff"
  },
  search: {
    margin: 10,
    backgroundColor: "#ededed",
    borderRadius: 8,
    paddingLeft: 12
  },
  searchLine: {
    flexDirection: "row",
    alignItems: "center"
  },
  queryTypeBox: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  queryType: {
    marginRight: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3
  },
  queryTypeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff"
  },
  input: {
    height: 44,
    fontSize: 16,
    paddingLeft: 10,
    flex: 1,
    marginRight: 12,
    paddingBottom: ANDROID ? 1 : 0
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: RED,
    height: 28,
    paddingHorizontal: 10
  },
  relativeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600"
  }
});
