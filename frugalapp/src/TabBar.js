import React, { Component } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Platform
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import moment from "moment";
import emitter from "tiny-emitter/instance";

import { BLUE } from "./Colors";
import { Constants } from "expo";

const bottomPadding = Platform.OS === "ios" && Constants.statusBarHeight > 40;

class Calendar extends Component {
  render() {
    const { selected, index, onPress } = this.props;

    const dateStyle = [styles.dateText];
    const textStyle = [styles.text];
    if (selected === index) {
      dateStyle.push(styles.blueText);
      textStyle.push(styles.blueText);
    }

    const today = moment();
    const date = today.format("M/D");
    const day = today.format("dddd");
    return (
      <TouchableOpacity style={styles.tab} onPress={onPress}>
        <View style={styles.icon}>
          <Text style={dateStyle}>{date}</Text>
        </View>
        <Text style={textStyle}>{day}</Text>
      </TouchableOpacity>
    );
  }
}

class Upload extends Component {
  render() {
    const { selected, index, onPress } = this.props;

    let iconColor = "#000";
    const textStyle = [styles.text];
    if (selected === index) {
      iconColor = BLUE;
      textStyle.push(styles.blueText);
    }
    return (
      <TouchableOpacity style={styles.tab} onPress={onPress}>
        <View style={styles.icon}>
          <Entypo name="circle-with-plus" size={18} color={iconColor} />
        </View>
        <Text style={textStyle}>Submit</Text>
      </TouchableOpacity>
    );
  }
}

class Map extends Component {
  render() {
    const { selected, index, onPress } = this.props;

    let iconColor = "#000";
    const textStyle = [styles.text];
    if (selected === index) {
      iconColor = BLUE;
      textStyle.push(styles.blueText);
    }
    return (
      <TouchableOpacity style={styles.tab} onPress={this.props.onPress}>
        <View style={styles.icon}>
          <Entypo name="map" size={18} color={iconColor} />
        </View>
        <Text style={textStyle}>Map</Text>
      </TouchableOpacity>
    );
  }
}

export default class TabBar extends Component {
  _onMap = () => {
    this.props.navigation.navigate("Map");
  };

  _onCalendar = () => {
    this.props.navigation.navigate("Calendar");
  };

  _onSubmit = () => {
    this.props.navigation.navigate("Submit");
    emitter.emit("focus-picker");
  };

  render() {
    const selected = this.props.navigation.state.index;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.footer}>
          <Calendar selected={selected} onPress={this._onCalendar} index={0} />
          <Upload selected={selected} index={1} onPress={this._onSubmit} />
          <Map selected={selected} index={2} onPress={this._onMap} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0"
  },
  footer: {
    height: 50,
    flexDirection: "row"
  },
  icon: {
    paddingTop: 7,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  tab: {
    justifyContent: bottomPadding ? "space-between" : "center",
    alignItems: "center",
    flex: 1
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500"
  },
  text: {
    fontSize: 10,
    fontWeight: "500"
  },
  blueText: {
    color: BLUE
  }
});
