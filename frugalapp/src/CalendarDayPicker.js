import React, { PureComponent } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import * as Events from "./store/events";
import emitter from "tiny-emitter/instance";

class DayPicker extends PureComponent {
  _selectDay = day => {
    if (day === this.props.day && this.props.scroll) {
      requestAnimationFrame(() => {
        emitter.emit("calendar-top", 0, true);
      });
      return;
    }
    requestAnimationFrame(() => {
      this.props.set({
        day
      });
    });
  };

  render() {
    const { calendar, day, recent, list } = this.props;
    const days = [...list, ...recent, ...calendar];
    return (
      <View style={styles.container}>
        {days.map(data => {
          const btnStyle = [styles.btnBg];
          if (day === data.title) {
            btnStyle.push(styles.selected);
          }
          const onPress = this._selectDay.bind(null, data.title);
          return (
            <View key={data.title} style={btnStyle}>
              <TouchableOpacity style={styles.btn} onPress={onPress}>
                <Text style={styles.btnText}>{data.title}</Text>
                <View style={styles.count}>
                  <Text style={styles.btnText}>{data.data.length}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  day: state.events.day,
  calendar: state.events.calendar,
  recent: state.events.recent,
  list: state.events.list
});

const mapDispatchToProps = {
  set: Events.actions.set
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DayPicker);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 3.5
  },
  btnBg: {
    margin: 3.5,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(100,100,100,0.7)"
  },
  selected: {
    backgroundColor: "rgba(0,0,0,0.65)"
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15
  },
  btnText: {
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
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center"
  }
});
