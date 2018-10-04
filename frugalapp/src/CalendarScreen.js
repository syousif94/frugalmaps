import React, { Component } from "react";
import { StyleSheet, View, SectionList } from "react-native";
import _ from "lodash";

import Item from "./CalendarItem";
import LocationBox from "./LocationBox";
import Header from "./CalendarListHeader";
import LocationUIProvider from "./LocationUI";
import { Consumer as EventConsumer } from "./Events";
import LocationList from "./LocationList";

export default class CalendarScreen extends Component {
  state = {
    refreshing: false,
    data: []
  };

  render() {
    return (
      <LocationUIProvider>
        <EventConsumer>
          {({ refreshing, data, fetch }) => {
            return (
              <View style={styles.container}>
                <LocationBox />
                <SectionList
                  onRefresh={() => fetch()}
                  refreshing={refreshing}
                  style={styles.list}
                  renderItem={data => <Item {...data} key={data.index} />}
                  renderSectionHeader={data => (
                    <Header {...data} key={data.index} />
                  )}
                  ItemSeparatorComponent={() => <View style={styles.divider} />}
                  sections={data}
                  keyExtractor={(item, index) => item + index}
                />
                <LocationList />
              </View>
            );
          }}
        </EventConsumer>
      </LocationUIProvider>
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
