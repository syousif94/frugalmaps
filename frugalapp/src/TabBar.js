import React, { Component } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import moment from "moment";

class Calendar extends Component {
  render() {
    const today = moment();
    const date = today.format("M/D");
    const day = today.format("dddd");
    return (
      <TouchableOpacity style={styles.tab} onPress={this.props.onPress}>
        <View style={styles.icon}>
          <Text style={styles.dateText}>{date}</Text>
        </View>
        <Text style={styles.text}>{day}</Text>
      </TouchableOpacity>
    );
  }
}

class Upload extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.tab} onPress={this.props.onPress}>
        <View style={styles.icon}>
          <Entypo name="circle-with-plus" size={18} color="#000" />
        </View>
        <Text style={styles.text}>Submit</Text>
      </TouchableOpacity>
    );
  }
}

class Map extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.tab} onPress={this.props.onPress}>
        <View style={styles.icon}>
          <Entypo name="map" size={18} color="#000" />
        </View>
        <Text style={styles.text}>Map</Text>
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
    justifyContent: "space-between",
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
  }
});
