import React, { Component } from "react";
import { StyleSheet, View, SectionList } from "react-native";

import Item from "./CalendarItem";
import LocationBox from "./LocationBox";
import Header from "./CalendarListHeader";

const event = {
  placeId: null,
  title: "$2 Tacos!",
  description: "Random Bar has dank aff tacos every tuesday.",
  location: "Random Bar",
  coordinates: [],
  start: "16:00",
  end: "20:00",
  street: "24 Blah Street",
  area: "Lido",
  city: "Newport Beach"
};

const days = [
  { title: "Monday", data: [event, event, event, event] },
  { title: "Tuesday", data: [event, event, event] },
  { title: "Wednesday", data: [event, event, event, event, event, event] },
  { title: "Thursday", data: [event, event, event, event, event] },
  { title: "Friday", data: [event, event, event, event, event] },
  { title: "Saturday", data: [event, event, event, event] },
  { title: "Sunday", data: [event, event, event, event] }
];

export default class CalendarScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <LocationBox />
        <SectionList
          style={styles.list}
          renderItem={data => <Item {...data} key={data.index} />}
          renderSectionHeader={data => <Header {...data} key={data.index} />}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          sections={days}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0"
  },
  list: {
    flex: 1
  },
  divider: {
    height: 1,
    backgroundColor: "#f2f2f2"
  }
});
