import React, { PureComponent } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import emitter from "tiny-emitter/instance";

export default class CalendarListHeader extends PureComponent {
  static height = 28;

  _onPress = () => {
    emitter.emit("toggle-map");
  };

  render() {
    const { section } = this.props;

    if (!section) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.titleText}>{section.title}</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={this._onPress}>
          <Entypo
            style={styles.icon}
            name="chevron-down"
            size={14}
            color="#fff"
          />
          <Text style={styles.btnText}>Map</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(90,90,90,0.45)",
    height: CalendarListHeader.height,
    flexDirection: "row",
    alignItems: "center"
  },
  info: {
    paddingHorizontal: 10,
    flex: 1
  },
  titleText: {
    fontWeight: "600",
    color: "#fff"
  },
  btn: {
    height: 20,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.2)",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
    paddingLeft: 8,
    marginRight: 4
  },
  btnText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6
  },
  icon: {
    marginTop: 2
  }
});
