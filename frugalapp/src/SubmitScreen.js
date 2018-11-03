import React, { Component } from "react";
import { connect } from "react-redux";
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
import * as Submission from "./store/submission";
import RestaurantPicker from "./RestaurantPicker";
import EditSpecial from "./EditSpecial";
import PlacePreview from "./PlacePreview";
import EventTypePicker from "./EventTypePicker";
import emitter from "tiny-emitter/instance";

import { BLUE } from "./Colors";
import DayPicker from "./SubmitDayPicker";

const mapStateToProps = state => ({
  title: state.submission.title,
  description: state.submission.description,
  startTime: state.submission.startTime,
  endTime: state.submission.endTime,
  postCode: state.submission.postCode,
  place: state.submission.place
});

const mapDispatchToProps = {
  set: Submission.actions.set
};

class SubmitScreen extends Component {
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
        this.props.set({
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
    if (this.props.place) {
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
    this.props.set({
      [field]: text
    });
    if (field === "postCode") {
      AsyncStorage.setItem("postCode", text);
    }
  };

  _selectRestaurant = place => {
    this.props.set({
      place
    });
    this._form.scrollToTop();
    this._swiper.scrollBy(1, true);
  };

  _submitForm = () => {
    this.props.set({
      saving: true
    });
  };

  _blurKeyboard = () => {
    Keyboard.dismiss();
  };

  render() {
    const pickerProps = {
      value: this.props.restaurant,
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
          <PlacePreview place={this.props.place} />
          <Text style={styles.instruction}>Select the days.</Text>
          <DayPicker />
          <Text style={styles.instruction}>
            Like 6:30pm. Leave blank for opening or closing.
          </Text>
          <View style={styles.row}>
            <TextInput
              placeholder="Start Time"
              style={[styles.input, styles.time]}
              placeholderTextColor="#999"
              onChangeText={this._onChangeText("startTime")}
              value={this.props.startTime}
              clearButtonMode="always"
              keyboardType="numbers-and-punctuation"
            />
            <TextInput
              placeholder="End Time"
              style={[styles.input, styles.time]}
              placeholderTextColor="#999"
              onChangeText={this._onChangeText("endTime")}
              value={this.props.endTime}
              clearButtonMode="always"
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <Text style={styles.instruction}>What's the special?</Text>
          <TextInput
            placeholder="Title"
            style={[styles.input, styles.title]}
            placeholderTextColor="#999"
            value={this.props.title}
            onChangeText={this._onChangeText("title")}
            clearButtonMode="always"
            autoCapitalize="words"
          />
          <Text style={styles.instruction}>Briefly describe it.</Text>
          <TextInput
            placeholder="Description"
            multiline
            style={[styles.input, styles.description]}
            placeholderTextColor="#999"
            blurOnSubmit
            value={this.props.description}
            onChangeText={this._onChangeText("description")}
          />
          <Text style={styles.instruction}>What kind of special?</Text>
          <EventTypePicker />
          <Text style={styles.instruction}>
            Leave blank unless you have one.
          </Text>
          <TextInput
            placeholder="Admin Code"
            style={[styles.input, styles.title]}
            placeholderTextColor="#999"
            onChangeText={this._onChangeText("postCode")}
            value={this.props.postCode}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmitScreen);

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
  row: {
    flexDirection: "row"
  },
  time: {
    height: 44,
    flex: 1
  },
  description: {
    lineHeight: 18,
    paddingTop: (44 - 18) / 2,
    paddingBottom: (44 - 18) / 2
  },
  submit: {
    margin: 5,
    marginTop: 20,
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
    fontWeight: "600"
  },
  instruction: {
    marginTop: 5,
    marginHorizontal: 5,
    color: "#555"
  }
});
