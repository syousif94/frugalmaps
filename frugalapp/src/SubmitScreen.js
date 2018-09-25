import React, { Component } from "react";
import { StyleSheet, TextInput, View, Keyboard } from "react-native";
import Swiper from "react-native-swiper";
import RestaurantPicker from "./RestaurantPicker";
import EditSpecial from "./EditSpecial";
import PlacePreview from "./PlacePreview";

export default class SubmitScreen extends Component {
  state = {
    place: null
  };

  _onChangeText = field => text => {
    this.setState({
      [field]: text
    });
  };

  _selectRestaurant = place => {
    this.setState({
      place
    });
    this._swiper.scrollBy(1, true);
  };

  _submitForm = () => {};

  _blurKeyboard = () => {
    Keyboard.dismiss();
  };

  render() {
    const pickerProps = {
      value: this.state.restaurant,
      onChangeText: this._onChangeText("restaurant"),
      select: this._selectRestaurant
    };
    return (
      <Swiper
        bounces
        showsPagination={false}
        alwaysBounceHorizontal
        ref={ref => (this._swiper = ref)}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        loop={false}
        onMomentumScrollEnd={this._blurKeyboard}
      >
        <RestaurantPicker {...pickerProps} />
        <EditSpecial>
          <PlacePreview place={this.state.place} />
          <TextInput
            placeholder="Title"
            style={[styles.input, styles.title]}
            placeholderTextColor="#333"
            value={this.state.title}
            onChangeText={this._onChangeText("title")}
          />
          <TextInput
            placeholder="Description"
            style={[styles.input, styles.description]}
            multiline
            placeholderTextColor="#333"
            blurOnSubmit
            value={this.state.description}
            onChangeText={this._onChangeText("description")}
          />
          <View style={styles.row}>
            <TextInput
              placeholder="Start Time"
              style={[styles.input, styles.time]}
              placeholderTextColor="#333"
              onChangeText={this._onChangeText("startTime")}
              value={this.state.startTime}
            />
            <TextInput
              placeholder="End Time"
              style={[styles.input, styles.time]}
              placeholderTextColor="#333"
              onChangeText={this._onChangeText("endTime")}
              value={this.state.endTime}
            />
          </View>
        </EditSpecial>
      </Swiper>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#ededed",
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 10,
    margin: 5
  },
  title: {
    height: 44
  },
  description: {
    height: 200,
    paddingTop: 8
  },
  row: {
    flexDirection: "row"
  },
  time: {
    height: 44,
    flex: 1
  }
});
