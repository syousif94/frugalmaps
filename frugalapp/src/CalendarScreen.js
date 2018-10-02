import React, { Component } from "react";
import { StyleSheet, View, SectionList } from "react-native";
import _ from "lodash";
import api from "./API";

import Item from "./CalendarItem";
import LocationBox from "./LocationBox";
import Header from "./CalendarListHeader";
import Provider, { Consumer } from "./Events";

export default class CalendarScreen extends Component {
  state = {
    refreshing: false,
    data: []
  };

  render() {
    return (
      <Provider>
        <Consumer>
          {({ refreshing, data, fetch }) => {
            console.log(data);
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
              </View>
            );
          }}
        </Consumer>
      </Provider>
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
