import React, { Component } from "react";
import _ from "lodash";
import { StyleSheet, View, TextInput, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-navigation";
import api from "./API";
import { Entypo } from "@expo/vector-icons";
import RestaurantSuggestion from "./RestaurantSuggestion";
import LocationPrompt from "./LocationPrompt";
import { Consumer as LocationConsumer } from "./Location";

export default React.forwardRef((props, ref) => (
  <LocationConsumer>
    {({ location }) => (
      <RestaurantPicker location={location} ref={ref} {...props} />
    )}
  </LocationConsumer>
));

class RestaurantPicker extends Component {
  state = {
    data: []
  };

  constructor(props) {
    super(props);

    this._fetchSuggestions = _.throttle(async text => {
      try {
        let query = `input=${text}&types=establishment`;

        if (this.props.location) {
          const { longitude, latitude } = this.props.location;
          const locationQuery = `&location=${latitude},${longitude}&radius=10000`;
          query = `${query}${locationQuery}`;
        }

        const res = await api("places/suggest", {
          query
        });

        if (this.props.value === "") {
          return;
        }

        this.setState({
          data: res.values
        });
      } catch (error) {
        console.log(error);
      }
    }, 50);
  }

  focusInput = () => {
    this._input.focus();
  };

  _onChangeText = text => {
    this.props.onChangeText(text);
    if (text === "") {
      this.setState({
        data: []
      });
    } else {
      this._fetchSuggestions(text);
    }
  };

  _renderItem = data => (
    <RestaurantSuggestion
      {...data}
      onPress={this.props.select}
      key={data.item.place_id}
    />
  );

  _keyExtractor = (item, index) => item.place_id;

  render() {
    const { onChangeText, ...props } = this.props;
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.title}>
            <Text style={styles.titleText}>Submit a Special</Text>
          </View>
          <View style={styles.search}>
            <Entypo name="magnifying-glass" size={18} color="#000" />
            <TextInput
              {...props}
              ref={ref => (this._input = ref)}
              style={styles.input}
              placeholder="Restaurant"
              onChangeText={this._onChangeText}
              placeholderTextColor="#333"
              returnKeyType="search"
              clearButtonMode="always"
              autoCorrect={false}
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
          keyboardShouldPersistTaps="handled"
          alwaysBounceVertical
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
        <LocationPrompt />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5
  },
  titleText: {
    fontWeight: "600",
    fontSize: 18,
    color: "#000"
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
    paddingLeft: 10,
    marginRight: 10,
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
