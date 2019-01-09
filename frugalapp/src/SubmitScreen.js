import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
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
import SubmissionInput from "./SubmissionInput";

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
    emitter.on("scroll-submit", this._scrollSwiper);
    this._restorePostCode();
  }

  componentWillUnmount() {
    emitter.off("scroll-submit", this._scrollSwiper);
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

  _scrollSwiper = (page, animated = true) => {
    const distance = page - this._swiper.state.index;
    if (distance !== 0) {
      this._swiper.scrollBy(distance, animated);
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

  _toggleKeyboard = index => {
    this._blurKeyboard();
    // if (index === 0) {
    //   this._picker.getWrappedInstance().focusInput();
    // } else {
    //   this._blurKeyboard();
    // }
  };

  _renderDelete = () => {
    if (!this.props.id) {
      return null;
    }

    const text = this.props.deleting ? "Deleting..." : `Delete Special`;

    const disabled = this.props.saving || this.props.deleting;

    const style = [styles.btnContainer, styles.delete];
    if (disabled) {
      style.push(styles.disabled);
    }

    return (
      <View style={style}>
        <TouchableOpacity
          style={styles.btn}
          onPress={this._deletePost}
          disabled={disabled}
        >
          <Text style={styles.btnText}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderSubmit = () => {
    const type = this.props.id ? "Update" : "Submit";
    const text = this.props.saving ? "Saving..." : `${type} Special`;

    const disabled = this.props.saving || this.props.deleting;

    const style = [styles.btnContainer, styles.submit];
    if (disabled) {
      style.push(styles.disabled);
    }

    return (
      <View style={style}>
        <TouchableOpacity
          style={styles.btn}
          onPress={this._submitForm}
          disabled={disabled}
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
          index={1}
          showsPagination={false}
          alwaysBounceHorizontal
          ref={ref => {
            this._swiper = ref;
          }}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          loop={false}
          onIndexChanged={this._toggleKeyboard}
        >
          <RestaurantPicker
            ref={ref => {
              this._picker = ref;
            }}
            select={this._selectRestaurant}
          />
          <EditSpecial ref={ref => (this._form = ref)}>
            <View style={styles.header}>
              <Text style={styles.titleText}>Submit a Special</Text>
            </View>
            <PlacePreview />
            <Text style={styles.instruction}>Select the days.</Text>
            <DayPicker />
            <Text style={styles.instruction}>
              Like 6:30pm. Leave blank for opening or closing.
            </Text>
            <View style={styles.row}>
              <SubmissionInput
                containerStyle={styles.timeWrap}
                placeholder="Start Time"
                style={[styles.input, styles.time]}
                placeholderTextColor="#999"
                onChangeText={this._onChangeText("startTime")}
                value={this.props.startTime}
                keyboardType="numbers-and-punctuation"
                underlineColorAndroid="transparent"
              />
              <SubmissionInput
                containerStyle={styles.timeWrap}
                placeholder="End Time"
                style={[styles.input, styles.time]}
                placeholderTextColor="#999"
                onChangeText={this._onChangeText("endTime")}
                value={this.props.endTime}
                keyboardType="numbers-and-punctuation"
                underlineColorAndroid="transparent"
              />
            </View>
            <Text style={styles.instruction}>What's the special?</Text>
            <SubmissionInput
              placeholder="Title"
              style={[styles.input, styles.title]}
              placeholderTextColor="#999"
              value={this.props.title}
              onChangeText={this._onChangeText("title")}
              autoCapitalize="words"
              underlineColorAndroid="transparent"
            />
            <Text style={styles.instruction}>Briefly describe it.</Text>
            <SubmissionInput
              placeholder="Description"
              multiline
              style={[styles.input, styles.description]}
              placeholderTextColor="#999"
              value={this.props.description}
              onChangeText={this._onChangeText("description")}
              blurOnSubmit
              underlineColorAndroid="transparent"
            />
            <Text style={styles.instruction}>What kind of special?</Text>
            <EventTypePicker />
            <Text style={styles.instruction}>
              Leave blank unless you have one.
            </Text>
            <SubmissionInput
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
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5
  },
  titleText: {
    fontWeight: "600",
    fontSize: 18,
    color: "#000"
  },
  title: {
    height: 44
  },
  row: {
    flexDirection: "row"
  },
  timeWrap: {
    flex: 1
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
  disabled: {
    backgroundColor: "#e0e0e0"
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
