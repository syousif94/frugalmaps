import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
  Text,
  AsyncStorage,
  Alert
} from "react-native";
import Swiper from "react-native-swiper";
import * as Submission from "./store/submission";
import RestaurantPicker from "./RestaurantPicker";
import EditSpecial from "./EditSpecial";
import PlacePreview from "./PlacePreview";
import EventTypePicker from "./EventTypePicker";
import emitter from "tiny-emitter/instance";

import { BLUE, RED } from "./Colors";
import DayPicker from "./SubmitDayPicker";
import { validSubmission } from "./ValidateSubmission";

const mapStateToProps = state => ({
  id: state.submission.id,
  fid: state.submission.fid,
  title: state.submission.title,
  description: state.submission.description,
  startTime: state.submission.startTime,
  endTime: state.submission.endTime,
  postCode: state.submission.postCode,
  place: state.submission.place,
  saving: state.submission.saving,
  deleting: state.submission.deleting
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
      place,
      id: null,
      fid: null
    });
    this._form.scrollToTop();
    this._swiper.scrollBy(1, true);
  };

  _submitForm = () => {
    if (validSubmission()) {
      this.props.set({
        saving: true
      });
    }
  };

  _deletePost = () => {
    Alert.alert("Are you sure?", "Deleting a post cannot be undone", [
      {
        text: "Delete",
        onPress: () => {
          this.props.set({
            deleting: true
          });
        },
        style: "destructive"
      },
      { text: "Cancel", style: "cancel" }
    ]);
  };

  _blurKeyboard = () => {
    Keyboard.dismiss();
  };

  _renderDelete = () => {
    if (!this.props.id && !this.props.fid) {
      return null;
    }

    const text = this.props.deleting ? "Deleting..." : "Delete Special";

    return (
      <View style={[styles.btnContainer, styles.delete]}>
        <TouchableOpacity
          style={styles.btn}
          onPress={this._deletePost}
          disabled={this.props.saving || this.props.deleting}
        >
          <Text style={styles.btnText}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderSubmit = () => {
    const text = this.props.saving ? "Saving..." : "Submit Special";
    return (
      <View style={[styles.btnContainer, styles.submit]}>
        <TouchableOpacity
          style={styles.btn}
          onPress={this._submitForm}
          disabled={this.props.saving || this.props.deleting}
        >
          <Text style={styles.btnText}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
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
            select={this._selectRestaurant}
          />
          <EditSpecial ref={ref => (this._form = ref)}>
            <PlacePreview />
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
                underlineColorAndroid="transparent"
              />
              <TextInput
                placeholder="End Time"
                style={[styles.input, styles.time]}
                placeholderTextColor="#999"
                onChangeText={this._onChangeText("endTime")}
                value={this.props.endTime}
                clearButtonMode="always"
                keyboardType="numbers-and-punctuation"
                underlineColorAndroid="transparent"
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
              underlineColorAndroid="transparent"
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
              underlineColorAndroid="transparent"
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
              underlineColorAndroid="transparent"
            />
            {this._renderSubmit()}
            {this._renderDelete()}
          </EditSpecial>
        </Swiper>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmitScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
  },
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
  btnContainer: {
    height: 44,
    borderRadius: 8,
    margin: 5
  },
  submit: {
    marginTop: 20,
    backgroundColor: BLUE
  },
  delete: {
    backgroundColor: RED
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
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
