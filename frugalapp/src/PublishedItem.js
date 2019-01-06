import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { ABBREVIATED_DAYS } from "./Constants";
import { GREEN, RED } from "./Colors";

class PublishedItem extends Component {
  render() {
    const {
      item: { _id: id, _source: item },
      index
    } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.titleText}>
            {index + 1}. {item.location}
          </Text>
          <Text style={styles.subtext}>{item.city}</Text>
          <View style={styles.days}>
            {item.days.map((day, index) => {
              return (
                <View key={`${index}${day}`} style={styles.day}>
                  <Text style={styles.dayText}>{ABBREVIATED_DAYS[day]}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.subtext}>{item.description}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default PublishedItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    minHeight: 44
  },
  btn: {
    flex: 1,
    padding: 10
  },
  titleText: {
    fontSize: 14,
    fontWeight: "500"
  },
  subtext: {
    fontSize: 12,
    color: "#444"
  },
  days: {
    flexDirection: "row",
    marginVertical: 2
  },
  day: {
    backgroundColor: GREEN,
    borderRadius: 3,
    paddingVertical: 1,
    paddingHorizontal: 3,
    marginRight: 2,
    marginTop: 2
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff"
  }
});
