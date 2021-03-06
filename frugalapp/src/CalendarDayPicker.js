import React, { PureComponent } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import * as Events from "./store/events";
import emitter from "tiny-emitter/instance";
import moment from "moment";

class DayPicker extends PureComponent {
  _selectDay = day => {
    if (day === this.props.day && this.props.scroll) {
      requestAnimationFrame(() => {
        emitter.emit("calendar-top", 0, true);
      });
      return;
    }
    emitter.emit("hide-sort");
    requestAnimationFrame(() => {
      this.props.set({
        day
      });
    });
  };

  render() {
    const { calendar, recent, list, closest, location } = this.props;
    if (!list.length) {
      return null;
    }
    let days;
    if (closest[0].data.length) {
      days = [...list, ...calendar, ...closest, ...recent];
    } else {
      days = [...list, ...calendar, ...recent];
    }
    return (
      <ScrollView
        style={styles.scroll}
        horizontal
        alwaysBounceHorizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {days.map((data, index) => {
          const btnStyle = [styles.btnBg];
          const onPress = this._selectDay.bind(null, data.title);
          let subText;

          if (!index) {
            subText = moment().format("ddd M/D");
          } else if (data.away !== undefined) {
            switch (data.away) {
              case 0:
                subText = "Today";
                break;
              case 1:
                subText = "Tomorrow";
                break;
              default:
                subText = `${data.away} days away`;
            }
          } else if (data.title === "Closest") {
            subText = location;
          } else if (data.title === "Newest") {
            subText = "Events";
          }

          return (
            <View key={data.title} style={btnStyle}>
              <TouchableOpacity style={styles.btn} onPress={onPress}>
                <View>
                  <Text style={styles.btnText}>{data.title}</Text>
                  <Text style={styles.subText}>{subText}</Text>
                </View>
                <View style={styles.count}>
                  <Text style={styles.countText}>{data.data.length}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  day: state.events.day,
  calendar: state.events.calendar,
  recent: state.events.recent,
  list: state.events.list,
  closest: state.events.closest,
  location: state.location.text
});

const mapDispatchToProps = {
  set: Events.actions.set
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DayPicker);

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 44
  },
  content: {
    paddingRight: 10
  },
  btnBg: {
    height: 44
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10
  },
  btnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000"
  },
  subText: {
    fontSize: 10,
    color: "#444"
  },
  countText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff"
  },
  count: {
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 8,
    minWidth: 20,
    marginLeft: 10,
    marginRight: 5,
    backgroundColor: "#6C7B80",
    justifyContent: "center",
    alignItems: "center"
  }
});
