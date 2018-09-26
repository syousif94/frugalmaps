import React, { Component } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
  Text
} from "react-native";
import Swiper from "react-native-swiper";
import RestaurantPicker from "./RestaurantPicker";
import EditSpecial from "./EditSpecial";
import PlacePreview from "./PlacePreview";
import emitter from "tiny-emitter/instance";

import { BLUE } from "./Colors";
import DayPicker from "./DayPicker";

export default class SubmitScreen extends Component {
  state = {
    place: null
  };

  componentDidMount() {
    emitter.on("focus-picker", this._scrollSwiper);
  }

  componentWillUnmount() {
    emitter.off("focus-picker", this._scrollSwiper);
  }

  _scrollSwiper = () => {
    if (this.state.place) {
      return;
    }
    if (this._swiper && this._swiper.state.index > 0) {
      const distance = -this._swiper.state.index;
      this._swiper.scrollBy(distance, true);
      setTimeout(() => {
        this._picker.focusInput();
      }, 500);
    } else {
      this._picker.focusInput();
    }
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
        ref={ref => {
          this._swiper = ref;
        }}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        loop={false}
        onMomentumScrollEnd={this._blurKeyboard}
      >
        <RestaurantPicker ref={ref => (this._picker = ref)} {...pickerProps} />
        <EditSpecial>
          <PlacePreview place={this.state.place} />
          <TextInput
            placeholder="Title"
            style={[styles.input, styles.title]}
            placeholderTextColor="#333"
            value={this.state.title}
            onChangeText={this._onChangeText("title")}
            clearButtonMode="always"
          />
          <TextInput
            placeholder="Description"
            style={[styles.input, styles.description]}
            multiline
            placeholderTextColor="#333"
            blurOnSubmit
            value={this.state.description}
            onChangeText={this._onChangeText("description")}
            clearButtonMode="always"
          />
          <DayPicker />
          <View style={styles.row}>
            <TextInput
              placeholder="Start Time"
              style={[styles.input, styles.time]}
              placeholderTextColor="#333"
              onChangeText={this._onChangeText("startTime")}
              value={this.state.startTime}
              clearButtonMode="always"
            />
            <TextInput
              placeholder="End Time"
              style={[styles.input, styles.time]}
              placeholderTextColor="#333"
              onChangeText={this._onChangeText("endTime")}
              value={this.state.endTime}
              clearButtonMode="always"
            />
          </View>
          <TextInput
            placeholder="Admin Code"
            style={[styles.input, styles.title]}
            placeholderTextColor="#333"
            onChangeText={this._onChangeText("postCode")}
            value={this.state.postCode}
          />
          <View style={styles.submit}>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={this._submitForm}
            >
              <Text style={styles.submitText}>Submit Special</Text>
            </TouchableOpacity>
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
  },
  submit: {
    margin: 5,
    height: 44,
    backgroundColor: BLUE,
    borderRadius: 8
  },
  submitBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  submitText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "500"
  }
});
