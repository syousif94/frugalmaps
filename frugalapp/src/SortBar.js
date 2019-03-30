import React, { PureComponent } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import emitter from "tiny-emitter/instance";
import { Entypo } from "@expo/vector-icons";
import { connect } from "react-redux";
import { getInset } from "./SafeAreaInsets";
import CityPicker from "./CalendarCityPicker";
import DayPicker from "./CalendarDayPicker";
import SubmitButton from "./SubmitButton";

class SortBar extends PureComponent {
  state = {
    expanded: new Animated.Value(0)
  };

  componentDidMount() {
    emitter.on("hide-sort", this._hide);
  }

  componentWillUnmount() {
    emitter.off("hide-sort", this._hide);
  }

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

  _hide = () => {
    if (this._expanded) {
      this._toggleExpanded();
    }
  };

  render() {
    const { location, day: order } = this.props;
    const locationText = location.length ? location.split(",")[0] : "Locating";

    const translateY = this.state.expanded.interpolate({
      inputRange: [0, 1],
      outputRange: [88, 0]
    });

    const panelStyle = [
      styles.panel,
      {
        transform: [{ translateY }]
      }
    ];

    const opacity = this.state.expanded.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1]
    });

    const fadeStyle = { opacity };

    const rotate = this.state.expanded.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"]
    });

    const iconStyle = {
      transform: [{ rotate }]
    };

    return (
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View style={panelStyle}>
          <Animated.View style={fadeStyle}>
            <CityPicker tabLabel="Closest" />
            <DayPicker />
          </Animated.View>
        </Animated.View>
        <View style={styles.btns}>
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={this._toggleExpanded}
          >
            <View style={styles.category}>
              <Text style={styles.subText}>City</Text>
              <Text style={styles.btnText}>{locationText}</Text>
            </View>
            <View style={styles.category}>
              <Text style={styles.subText}>Sort</Text>
              <Text style={styles.btnText}>{order}</Text>
            </View>
            <View style={styles.category}>
              <Text style={styles.subText}>Type</Text>
              <Text style={styles.btnText}>All</Text>
            </View>
            <View style={styles.icon}>
              <Animated.View style={iconStyle}>
                <Entypo name="chevron-up" size={14} color="#999" />
              </Animated.View>
            </View>
          </TouchableOpacity>
          <SubmitButton />
        </View>
      </View>
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
    height: (bottomInset > 0 ? bottomInset + 38 : 40) + 88,
    paddingBottom: bottomInset,
    right: 5,
    left: 5,
    justifyContent: "flex-end"
  },
  panel: {
    ...StyleSheet.absoluteFillObject,
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
    height: bottomInset > 0 ? 38 : 40,
    flexDirection: "row",
    alignItems: "center",
    elevation: 6
  },
  sortBtn: {
    flexDirection: "row",
    flex: 1
  },
  category: {
    marginHorizontal: 10,
    justifyContent: "center"
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
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 20,
    top: 0,
    bottom: 0
  }
});
