import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import * as Submissions from "./store/submissions";
import RestaurantSuggestion from "./RestaurantSuggestion";
import { db } from "./Firebase";

const mapStateToProps = state => ({
  data: state.submissions.data,
  suggestions: Submissions.restaurantSuggestions(state)
});

const mapDispatchToProps = {
  set: Submissions.actions.set
};

class PickerHeader extends Component {
  componentDidMount() {
    if (!this.props.data.length) {
      this.props.set({
        refreshing: true
      });
    }

    this._unsub = db.collection("submissions").onSnapshot(querySnapshot => {
      console.log(querySnapshot.size);
    });
  }

  componentWillUnmount() {
    this._unsub();
  }

  _onPress = () => {
    this.props.navigation.navigate("Submissions");
  };

  render() {
    const { suggestions, data } = this.props;
    const count = data.length;
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
        <TouchableOpacity style={styles.btn} onPress={this._onPress}>
          <Text style={styles.btnText}>Submissions</Text>
          <View style={styles.count}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.published}>
          <Text style={styles.publishedText}>Published</Text>
        </View>
      </View>
    );
  }
}

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PickerHeader)
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
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
