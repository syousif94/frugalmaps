import React, { Component } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import SearchHeader from "./SearchHeader";
import api from "./API";

import PublishedItem from "./PublishedItem";

export default class PublishedScreen extends Component {
  state = {
    query: "",
    data: []
  };
  async componentDidMount() {
    const res = await api("events/published");
    console.log({ res });
    this.setState({
      data: res.published
    });
  }
  _onChangeQuery = query => {
    this.setState({
      query
    });
  };

  _renderItem = data => {
    return <PublishedItem {...data} />;
  };

  render() {
    return (
      <View style={styles.container}>
        <SearchHeader
          title="Published"
          placeholder="Search"
          onChangeText={() => {}}
          value={this.state.query}
        />
        <View style={styles.divider} />
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          style={styles.list}
          keyExtractor={item => item._id}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      </View>
    );
  }
}

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
