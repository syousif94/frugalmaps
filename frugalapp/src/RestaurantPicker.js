import React, { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import RestaurantsSuggesting from "./RestaurantsSuggesting";
import SubmissionInput from "./SubmissionInput";
import * as Submissions from "./store/submissions";
import * as Submission from "./store/submission";
import RestaurantSuggestion from "./RestaurantSuggestion";

const mapState = state => ({
  suggestions: Submissions.restaurantSuggestions(state),
  value: state.submissions.filter
});

const mapActions = {
  setSubmissions: Submissions.actions.set,
  setSubmission: Submission.actions.set
};

class RestaurantPicker extends Component {
  _onChangeText = text => {
    this.props.setSubmissions({
      filter: text
    });
  };
  _onSelect = place => {
    this.props.setSubmission({
      place,
      id: null,
      fid: null
    });
  };
  render() {
    const { suggestions, value } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.instruction}>Select a restaurant.</Text>
        <View style={styles.search}>
          <Entypo name="magnifying-glass" size={18} color="#000" />
          <SubmissionInput
            containerStyle={styles.inputContainer}
            value={value}
            ref={ref => (this._input = ref)}
            style={styles.input}
            placeholder="Restaurant"
            onChangeText={this._onChangeText}
            placeholderTextColor="#999"
            returnKeyType="done"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            selectTextOnFocus
          />
          <RestaurantsSuggesting />
        </View>
        {suggestions
          .filter(item => item && item.place_id && item.name)
          .map((item, index) => {
            return (
              <RestaurantSuggestion
                item={item}
                index={index}
                onPress={this._onSelect}
                key={item.place_id}
              />
            );
          })}
      </View>
    );
  }
}

export default connect(
  mapState,
  mapActions
)(RestaurantPicker);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  instruction: {
    marginTop: 10,
    marginBottom: 5,
    color: "#555"
  },
  search: {
    backgroundColor: "#ededed",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12
  },
  inputContainer: {
    flex: 1
  },
  input: {
    height: 44,
    fontSize: 16,
    paddingLeft: 10,
    flex: 1
  }
});
