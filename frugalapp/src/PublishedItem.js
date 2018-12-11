import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

class PublishedItem extends Component {
  render() {
    const {
      item: { _id: id, _source: item },
      index
    } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btn}>
          <Text>
            {index + 1}. {item.title} - {item.location}
          </Text>
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
  }
});
