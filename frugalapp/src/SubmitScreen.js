import React, { Component } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
  Text,
  AsyncStorage
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
    this._restorePostCode();
  }

  componentWillUnmount() {
    emitter.off("focus-picker", this._scrollSwiper);
  }

  _restorePostCode = async () => {
    try {
      const value = await AsyncStorage.getItem("postCode");
      if (value !== null) {
        this.setState({
          postCode: value
        });
      }
    } catch (error) {
      console.log({
        postCodeError: error
      });
    }
  };

  _scrollSwiper = () => {
    if (this.state.place) {
      if (this._swiper.state.index === 0) {
        this._swiper.scrollBy(1, false);
      }
      return;
    }
    if (this._swiper && this._swiper.state.index > 0) {
      const distance = -this._swiper.state.index;
      this._swiper.scrollBy(distance, true);
      setTimeout(() => {
        this._picker.getWrappedInstance().focusInput();
      }, 500);
    } else {
      this._picker.getWrappedInstance().focusInput();
    }
  };

  _onChangeText = field => text => {
    this.setState({
      [field]: text
    });
    if (field === "postCode") {
      AsyncStorage.setItem("postCode", text);
    }
  };

  _selectRestaurant = place => {
    this.setState({
      place
    });
    this._form.scrollToTop();
    this._swiper.scrollBy(1, true);
  };

  _submitForm = () => {
    const {
      title,
      description,
      startTime,
      endTime,
      postCode,
      place
    } = this.state;

    const { selected } = this._days.state;

    console.log({
      title,
      description,
      startTime,
      endTime,
      postCode,
      selected,
      place
    });
  };

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
        <RestaurantPicker
          ref={ref => {
            this._picker = ref;
          }}
          {...pickerProps}
        />
        <EditSpecial ref={ref => (this._form = ref)}>
          <PlacePreview place={this.state.place} />
          <Text style={styles.instruction}>What's the special?</Text>
          <TextInput
            placeholder="Title"
            style={[styles.input, styles.title]}
            placeholderTextColor="#333"
            value={this.state.title}
            onChangeText={this._onChangeText("title")}
            clearButtonMode="always"
            autoCapitalize="words"
          />
          <Text style={styles.instruction}>Briefly describe it.</Text>
          <TextInput
            placeholder="Description"
            style={[styles.input, styles.description]}
            multiline
            placeholderTextColor="#333"
            blurOnSubmit
            value={this.state.description}
            onChangeText={this._onChangeText("description")}
          />
          <Text style={styles.instruction}>Select the days.</Text>
          <DayPicker ref={ref => (this._days = ref)} />
          <Text style={styles.instruction}>
            Format hours like 6:30pm. Leave blank if all day.
          </Text>
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
          <Text style={styles.instruction}>Only admins can post for now.</Text>
          <TextInput
            placeholder="Admin Code"
            style={[styles.input, styles.title]}
            placeholderTextColor="#333"
            onChangeText={this._onChangeText("postCode")}
            value={this.state.postCode}
            autoCorrect={false}
            autoCapitalize="none"
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
    height: 110,
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
  },
  instruction: {
    marginTop: 5,
    marginHorizontal: 5,
    color: "#a9a9a9"
  }
});
