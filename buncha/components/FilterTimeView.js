import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { BLUE } from "../utils/Colors";
import * as Filters from "../store/filters";
import * as Events from "../store/events";
import { useEveryMinute } from "../utils/Hooks";
import moment from "moment";
import TimeInput from "./TimeInput";

export default ({ bottomOffset, panelHeight }) => {
  return (
    <React.Fragment>
      <Text style={styles.subText}>Day</Text>
      <DayPicker />
      <Text style={styles.subText}>Time</Text>
      <TimeContainer bottomOffset={bottomOffset} panelHeight={panelHeight} />
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 10,
          justifyContent: "center"
        }}
      >
        <SearchButton />
      </View>
    </React.Fragment>
  );
};

const SearchButton = () => {
  const dispatch = useDispatch();
  const { validTime } = useSelector(Filters.validTimeSelector, shallowEqual);
  return (
    <TouchableOpacity
      style={[styles.button, { minWidth: 200 }]}
      disabled={!validTime}
      onPress={() => {
        dispatch(Events.getTime());
      }}
    >
      <Text style={styles.buttonText}>Search</Text>
    </TouchableOpacity>
  );
};

const DayPicker = () => {
  const dispatch = useDispatch();
  const calendar = useSelector(
    state => state.events.calendar.sort((a, b) => a.iso - b.iso),
    shallowEqual
  );
  const selectedDay = useSelector(state => state.filters.day);
  return (
    <View style={styles.days}>
      {calendar.map(day => {
        const dayTextStyle = [styles.dayText];
        if (selectedDay.title === day.title) {
          dayTextStyle.push({
            color: BLUE
          });
        }
        const eventCount = `${day.data.length}`;
        return (
          <View style={styles.day} key={day.title}>
            <TouchableOpacity
              onPress={() => {
                dispatch(Filters.setDay(day));
              }}
            >
              <Text style={dayTextStyle}>{day.title.substr(0, 3)}</Text>
              <Text style={styles.dayCountText}>{eventCount}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const TimeContainer = ({ bottomOffset, panelHeight }) => {
  const dispatch = useDispatch();
  const value = useSelector(state => state.filters.time);
  const onLayout = e => {
    const { y, height } = e.nativeEvent.layout;
    bottomOffset.current = -panelHeight + y + height;
  };
  return (
    <View
      style={{ marginHorizontal: 10, flexDirection: "row" }}
      onLayout={onLayout}
    >
      <View style={{ flex: 1 }}>
        <TimeInput
          value={value}
          onChangeText={text => {
            dispatch(Filters.setTime(text));
          }}
          placeholder="After"
          name="time"
          backgroundColor="rgba(0,0,0,0.04)"
        />
      </View>
      <NowButton />
    </View>
  );
};

const NowButton = () => {
  const dispatch = useDispatch();
  const [currentTime] = useEveryMinute();
  const timeText = moment().format("ddd h:mma");
  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(Filters.resetTime());
      }}
      onLongPress={() => {
        dispatch(Filters.resetTime());
        dispatch(Events.getTime());
      }}
      style={styles.now}
    >
      <Text style={styles.nowSubtext}>Now</Text>
      <Text style={styles.nowText}>{timeText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  subText: {
    marginLeft: 20,
    marginTop: 12,
    marginBottom: 8,
    fontSize: 12,
    color: "#444",
    fontWeight: "600"
  },
  now: {
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 5,
    justifyContent: "center",
    paddingHorizontal: 8,
    marginLeft: 8,
    height: 46
  },
  nowSubtext: {
    fontSize: 13,
    color: BLUE,
    fontWeight: "600"
  },
  nowText: {
    fontSize: 12,
    color: BLUE,
    fontWeight: "600"
  },
  button: {
    flexDirection: "row",
    paddingHorizontal: 15,
    height: 34,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    fontSize: 16,
    color: BLUE,
    fontWeight: "600"
  },
  days: {
    flexDirection: "row",
    paddingHorizontal: 7
  },
  day: {
    flex: 1,
    marginHorizontal: 3,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 5,
    overflow: "hidden"
  },
  dayText: {
    paddingVertical: 6,
    textAlign: "center",
    fontSize: 13,
    color: "rgba(0,0,0,0.7)",
    fontWeight: "600"
  },
  dayCountText: {
    textAlign: "center",
    paddingBottom: 6,
    color: "rgba(0,0,0,0.4)",
    fontSize: 11,
    fontWeight: "700"
  }
});
