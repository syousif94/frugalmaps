import React, { Component } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { connect } from "react-redux";
import SearchHeader from "./SearchHeader";
import api from "./API";

import PublishedItem from "./PublishedItem";
import * as Published from "./store/published";

const mapStateToProps = state => ({
  data: state.published.data,
  filter: state.published.filter,
  refreshing: state.published.refreshing
});

const mapDispatchToProps = {
  set: Published.actions.set
};

class PublishedScreen extends Component {
  componentDidMount() {
    if (!this.props.data.length) {
      this._onRefresh();
    }
  }

  _onChangeText = text => {
    this.props.set({
      filter: text
    });
  };

  _onRefresh = () => {
    this.props.set({
      refreshing: true
    });
  };

  _renderItem = data => {
    return <PublishedItem {...data} />;
  };

  _renderSeparator = () => <View style={styles.divider} />;

  render() {
    const { data, filter, refreshing } = this.props;
    return (
      <View style={styles.container}>
        <SearchHeader
          title="Published"
          placeholder="Search"
          onChangeText={this._onChangeText}
          value={filter}
        />
        <View style={styles.divider} />
        <FlatList
          refreshing={refreshing}
          onRefresh={this._onRefresh}
          data={data}
          renderItem={this._renderItem}
          style={styles.list}
          keyExtractor={item => item._id}
          ItemSeparatorComponent={this._renderSeparator}
          contentInsetAdjustmentBehavior="always"
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishedScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
  },
  list: {
    flex: 1,
    backgroundColor: "#fff"
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0"
  }
});
