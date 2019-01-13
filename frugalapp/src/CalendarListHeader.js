import React, { PureComponent } from "react";
import { StyleSheet, Text, View } from "react-native";

export default class CalendarListHeader extends PureComponent {
  static height = 28;

  render() {
    const { section } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.titleText}>{section.title}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    backgroundColor: "rgba(90,90,90,0.45)",
    height: CalendarListHeader.height
  },
  info: {
    paddingHorizontal: 10,
    flex: 1,
    alignItems: "center",
    flexDirection: "row"
  },
  titleText: {
    fontWeight: "600",
    color: "#fff"
  }
});
