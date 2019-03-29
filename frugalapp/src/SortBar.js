import React, { PureComponent } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { getInset } from "./SafeAreaInsets";
import CityPicker from "./CalendarCityPicker";
import DayPicker from "./CalendarDayPicker";
import SearchButton from "./SearchButton";
import SubmitButton from "./SubmitButton";

class SortBar extends PureComponent {
  state = {
    expanded: new Animated.Value(0)
  };

  _expanded = false;

  _toggleExpanded = () => {
    const toValue = this._expanded ? 0 : 1;
    this._expanded = !this._expanded;
    Animated.timing(
      this.state.expanded,
      { toValue, duration: 200 },
      { useNativeDriver: true }
    ).start();
  };

  render() {
    const { location, day: order } = this.props;
    const locationText = location.length
      ? location.replace(", USA", "")
      : "Locating";

    const translateY = this.state.expanded.interpolate({
      inputRange: [0, 1],
      outputRange: [88, 0]
    });

    const containerStyle = [
      styles.container,
      {
        transform: [{ translateY }]
      }
    ];
    return (
      <Animated.View style={containerStyle}>
        <View style={styles.btns}>
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={this._toggleExpanded}
          >
            <Text style={styles.subText}>City</Text>
            <Text style={styles.btnText}>{locationText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={this._toggleExpanded}
          >
            <Text style={styles.subText}>List</Text>
            <Text style={styles.btnText}>{order}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <SearchButton />
          <SubmitButton />
        </View>
        <CityPicker tabLabel="Closest" />
        <DayPicker />
      </Animated.View>
    );
  }
}

const mapState = state => ({
  location: state.location.lastQuery,
  day: state.events.day
});

export default connect(mapState)(SortBar);

const bottomInset = getInset("bottom");

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    right: 5,
    left: 5,
    height: (bottomInset > 0 ? bottomInset + 38 : 44) + 88,
    backgroundColor: "#fff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  btns: {
    height: bottomInset > 0 ? 38 : 44,
    flexDirection: "row"
  },
  sortBtn: {
    justifyContent: "center",
    paddingHorizontal: 10
  },
  btnText: {
    marginTop: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#000"
  },
  subText: {
    marginTop: bottomInset > 0 ? 2 : 0,
    fontSize: 10,
    color: "#444"
  }
});
