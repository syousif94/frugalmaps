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
import SearchButton from "./SearchButton";
import SubmitButton from "./SubmitButton";
import { SafeArea, IOS } from "./Constants";

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
    if (!list.length) {
      return null;
    }
    const days = [...list, ...recent, ...calendar];
    const insets = IOS ? { forceInset: { bottom: "always" } } : {};
    return (
      <SafeArea style={styles.container} {...insets}>
        <ScrollView
          style={styles.scroll}
          horizontal
          alwaysBounceHorizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <SearchButton />
          <SubmitButton />
          {days.map((data, index) => {
            const btnStyle = [styles.btnBg];
            if (day === data.title) {
              btnStyle.push(styles.selected);
            }
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
            }

            return (
              <View key={data.title} style={btnStyle}>
                <TouchableOpacity style={styles.btn} onPress={onPress}>
                  <View>
                    <Text style={styles.btnText}>{data.title}</Text>
                    <Text style={styles.subText}>{subText}</Text>
                  </View>
                  <View style={styles.count}>
                    <Text style={styles.btnText}>{data.data.length}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </SafeArea>
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },
  scroll: {
    height: 44
  },
  content: {
    padding: 3.5
    // paddingRight: 95
  },
  btnBg: {
    margin: 3.5,
    height: 30,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
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
    paddingLeft: 5
  },
  btnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff"
  },
  subText: {
    fontSize: 10,
    color: "#e0e0e0"
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
