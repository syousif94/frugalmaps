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
          <View style={styles.count}>
            <Text style={styles.countText}>{section.data.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.btn} onPress={this._onPress}>
          <View style={styles.btnBg}>
            <Entypo
              style={styles.icon}
              name="chevron-down"
              size={14}
              color="#fff"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(90,90,90,0.45)",
    height: CalendarListHeader.height,
    flexDirection: "row"
  },
  info: {
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff"
  },
  count: {
    height: 16,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 6,
    paddingHorizontal: 3
  },
  countText: {
    fontSize: 9,
    color: "#fff",
    fontWeight: "700"
  },
  btn: {
    justifyContent: "center",
    paddingRight: 6,
    paddingLeft: 60
  },
  btnBg: {
    borderRadius: 4,
    height: 16,
    backgroundColor: "rgba(0,0,0,0.2)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6
  },
  icon: {
    marginTop: 1
  }
});
