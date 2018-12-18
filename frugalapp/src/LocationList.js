import React, { Component } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { connect } from "react-redux";

import LocationSuggestion from "./LocationSuggestion";

import * as Location from "./store/location";
import LocationListFooter from "./LocationListFooter";

class LocationList extends Component {
  shouldComponentUpdate(next) {
    return next.data !== this.props.data;
  }

  _renderItem = data => (
    <LocationSuggestion
      id={this.props.id}
      type={this.props.tabLabel}
      {...data}
      key={data.index}
    />
  );

  render() {
    return (
      <FlatList
        contentContainerStyle={styles.content}
        style={styles.list}
        renderItem={this._renderItem}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        data={this.props.data}
        keyExtractor={(item, index) => item + index}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical
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
