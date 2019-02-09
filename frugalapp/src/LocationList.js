import React, { Component } from "react";
import { View, StyleSheet, FlatList } from "react-native";
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
      const key = `${data.item._id}${data.index}`;
      return <EventSuggestion {...data} key={key} />;
    }
    return (
      <LocationSuggestion
        id={this.props.id}
        type={this.props.tabLabel}
        {...data}
        key={data.index}
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
  }
});
