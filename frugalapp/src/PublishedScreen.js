import React, { Component } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import SearchHeader from "./SearchHeader";
import api from "./API";

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
  render() {
    return (
      <View style={styles.container}>
        <SearchHeader
          title="Published"
          placeholder="Search"
          onChangeText={() => {}}
          value={this.state.query}
        />
        <FlatList
          data={this.state.data}
          renderItem={({ item, index }) => {
            return <Text>{item._source.title}</Text>;
          }}
          style={{ flex: 1 }}
          keyExtractor={item => item._id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
