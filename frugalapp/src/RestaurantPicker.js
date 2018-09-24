import React, { Component } from "react";
import _ from "lodash";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView
} from "react-native";
import { SafeAreaView } from "react-navigation";
import api from "./API";
import { Entypo } from "@expo/vector-icons";
import RestaurantSuggestion from "./RestaurantSuggestion";

export default class RestaurantPicker extends Component {
  state = {
    data: []
  };

  constructor(props) {
    super(props);

    this._fetchSuggestions = _.debounce(async text => {
      try {
        const res = await api("places/suggest", {
          input: text
        });

        this.setState({
          data: res.values
        });
      } catch (error) {
        console.log(error);
      }
    }, 100);
  }

  _onChangeText = text => {
    this.props.onChangeText(text);
    this._fetchSuggestions(text);
  };

  _renderItem = data => (
    <RestaurantSuggestion
      onPress={this.props.select}
      {...data}
      key={data.item.place_id}
    />
  );

  _keyExtractor = (item, index) => item.place_id;

  render() {
    const { onChangeText, ...props } = this.props;
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.search}>
            <Entypo name="magnifying-glass" size={18} color="#000" />
            <TextInput
              {...props}
              style={styles.input}
              placeholder="Restaurant"
              onChangeText={this._onChangeText}
              placeholderTextColor="#333"
            />
          </View>
        </SafeAreaView>
        <View style={styles.divider} />
        <FlatList
          style={styles.list}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="always"
          alwaysBounceVertical
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
        <KeyboardAvoidingView behavior="height" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  search: {
    margin: 10,
    backgroundColor: "#ededed",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12
  },
  input: {
    height: 44,
    fontSize: 16,
    paddingHorizontal: 10,
    flex: 1
  },
  list: {
    flex: 1
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0"
  }
});
