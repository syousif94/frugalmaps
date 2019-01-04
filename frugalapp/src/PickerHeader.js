import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import * as Submissions from "./store/submissions";
import RestaurantSuggestion from "./RestaurantSuggestion";

const mapStateToProps = state => ({
  suggestions: Submissions.restaurantSuggestions(state),
  data: state.submissions.data
});

class PickerHeader extends Component {
  _onPressPublished = () => {
    this.props.navigation.navigate("Published");
  };

  _onPressSubmissions = () => {
    this.props.navigation.navigate("Submissions");
  };

  render() {
    const { data, suggestions } = this.props;
    return (
      <View style={styles.container}>
        {suggestions
          .filter(item => item && item.place_id && item.name)
          .map((item, index) => {
            return (
              <RestaurantSuggestion
                item={item}
                index={index}
                onPress={this.props.select}
                key={item.place_id}
              />
            );
          })}
        <TouchableOpacity style={styles.btn} onPress={this._onPressPublished}>
          <Text style={styles.btnText}>Published</Text>
          <View style={styles.count}>
            <Text style={styles.countText}>0</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
    );
  }
}

export default withNavigation(connect(mapStateToProps)(PickerHeader));

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0"
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    padding: 10
  },
  btnText: {
    fontWeight: "500"
  },
  count: {
    height: 18,
    borderRadius: 9,
    backgroundColor: "#6C7B80",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "transparent"
  }
});
