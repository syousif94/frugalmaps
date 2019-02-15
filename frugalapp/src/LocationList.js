import React, { Component } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { connect } from "react-redux";

import LocationSuggestion from "./LocationSuggestion";

import * as Location from "./store/location";
import LocationListFooter from "./LocationListFooter";
import EventSuggestion from "./EventSuggestion";

class LocationList extends Component {
  shouldComponentUpdate(next) {
    return next.data !== this.props.data;
  }

  _renderItem = data => {
    if (data.item._type === "event") {
      return <EventSuggestion {...data} />;
    }
    return (
      <LocationSuggestion
        id={this.props.id}
        type={this.props.tabLabel}
        {...data}
        // hide={this.props.hide}
      />
    );
  };

  _keyExtractor = (item, index) => {
    if (item._id) {
      return item._id;
    }
    return `${index}`;
  };

  _renderEmpty = () => {
    switch (this.props.tabLabel) {
      case "Search":
        return (
          <View style={styles.empty}>
            <Text style={styles.emptyHeader}>Type to search</Text>
            <Text style={styles.emptyText}>
              Try brunch, trivia, karaoke, wine, etc.
            </Text>
          </View>
        );
      case "Closest":
        return (
          <View style={styles.empty}>
            <Text style={styles.emptyHeader}>Location access required</Text>
            <Text style={styles.emptyText}>Enable in Settings</Text>
          </View>
        );
      default:
        return (
          <View style={styles.empty}>
            <Text style={styles.emptyHeader}>Probably still loading</Text>
          </View>
        );
    }
  };

  render() {
    return (
      <FlatList
        contentContainerStyle={styles.content}
        style={styles.list}
        renderItem={this._renderItem}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        data={this.props.data}
        keyExtractor={this._keyExtractor}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={true}
        ListEmptyComponent={this._renderEmpty}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  data: Location.makeData(state, props)
});

export default connect(mapStateToProps)(LocationList);

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0"
  },
  content: {
    paddingBottom: LocationListFooter.height
  },
  empty: {
    marginTop: 20,
    alignItems: "center"
  },
  emptyHeader: {
    fontSize: 14,
    color: "#777",
    fontWeight: "500",
    marginBottom: 8
  },
  emptyText: {
    fontSize: 12,
    color: "#444"
  }
});
