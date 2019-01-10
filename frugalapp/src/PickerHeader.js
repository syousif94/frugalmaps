import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import * as Submissions from "./store/submissions";
import RestaurantSuggestion from "./RestaurantSuggestion";

const mapStateToProps = state => ({
  count: Submissions.submissionsCount(state),
  suggestions: Submissions.restaurantSuggestions(state)
});

class PickerHeader extends Component {
  render() {
    const { suggestions } = this.props;
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
        <View style={styles.published}>
          <Text style={styles.publishedText}>Published</Text>
        </View>
      </View>
    );
  }
}

export default withNavigation(connect(mapStateToProps)(PickerHeader));

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  published: {
    backgroundColor: "rgba(90,90,90,0.45)",
    height: 28,
    paddingHorizontal: 10,
    alignItems: "center",
    flexDirection: "row"
  },
  publishedText: {
    fontWeight: "600",
    color: "#fff"
  }
});
