import React, { memo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { PAGE } from "../store/filters";
import { BLUE, RED } from "../utils/Colors";
import Input from "./Input";
import * as Filters from "../store/filters";
import * as Events from "../store/events";
import { useEveryMinute } from "../utils/Hooks";
import moment from "moment";
import { PANEL_HEIGHT } from "./FilterView";

const INVALID_TIME_HEIGHT = 22;

export default memo(({ page, bottomOffset }) => {
  const isPage = page === PAGE.WHEN;
  const pointerEvents = isPage ? "auto" : "none";
  return (
    <View
      pointerEvents={pointerEvents}
      style={[
        styles.container,
        {
          opacity: isPage ? 1 : 0
        }
      ]}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.titleText}>{PAGE.WHEN}</Text>
              <Text style={styles.subText}>Sort by time and day</Text>
            </View>
            <NowButton />
          </View>
        </View>
        <DayPicker />
        <Text style={styles.instructionText}>
          Time is optional, formats like 7, 11a, and 10:43pm are cool,{" "}
          <Text style={{ fontWeight: "700" }}>pm</Text> assumed
        </Text>
        <TimeContainer bottomOffset={bottomOffset} />
        <TimeInvalid />
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
            justifyContent: "center"
          }}
        >
          <SearchButton />
        </View>
      </ScrollView>
    </View>
  );
});

const TimeInvalid = () => {
  const { validTime } = useSelector(Filters.validTimeSelector);
  const textStyle = [
    styles.invalidTimeText,
    {
      opacity: validTime ? 0 : 1
    }
  ];
  return (
    <View style={styles.invalidTime}>
      <Text style={textStyle}>Invalid Time... </Text>
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
        dispatch(Events.getTime());
      }}
      style={styles.button}
    >
      <Text style={styles.buttonText}>{timeText}</Text>
    </TouchableOpacity>
  );
};

const SearchButton = memo(() => {
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
});

const DayPicker = memo(() => {
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
              style={styles.dayBtn}
              onPress={() => {
                dispatch(Filters.setDay(day));
              }}
            >
              <Text style={dayTextStyle}>{day.title}</Text>
              <View style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
                <Text style={styles.dayCountText}>{eventCount}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
});

const TimeContainer = memo(({ bottomOffset }) => {
  const onLayout = e => {
    const { y, height } = e.nativeEvent.layout;
    bottomOffset.current = -PANEL_HEIGHT + y + height + INVALID_TIME_HEIGHT;
  };
  return (
    <View style={{ marginHorizontal: 10, marginTop: 5 }} onLayout={onLayout}>
      <TimeInput />
      <TimeOverlay />
    </View>
  );
});

const TimeOverlay = memo(() => {
  const { validTime, expandedTime } = useSelector(
    Filters.validTimeSelector,
    shallowEqual
  );
  if (!validTime || !expandedTime) {
    return null;
  }
  return (
    <View style={styles.timeOverlay} pointerEvents="none">
      <Text style={styles.timeOverlayText}>{expandedTime}</Text>
    </View>
  );
});

const TimeInput = memo(() => {
  const dispatch = useDispatch();
  const selectedTime = useSelector(state => state.filters.time);
  return (
    <Input
      value={selectedTime}
      spellCheck={false}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder="Time"
      backgroundColor="rgba(0,0,0,0.04)"
      style={{ fontWeight: "600" }}
      onChangeText={text => {
        dispatch(Filters.setTime(text));
      }}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  content: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center"
  },
  header: {
    marginLeft: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)"
  },
  titleText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "700"
  },
  subText: {
    marginTop: 1,
    fontSize: 14,
    color: "#777",
    fontWeight: "500"
  },
  button: {
    flexDirection: "row",
    paddingHorizontal: 15,
    height: 34,
    borderRadius: 34 / 2,
    backgroundColor: BLUE,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700"
  },
  days: {
    flexDirection: "row",
    padding: 7,
    flexWrap: "wrap"
  },
  day: {
    margin: 3,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 5,
    overflow: "hidden"
  },
  dayBtn: {
    flexDirection: "row"
  },
  dayText: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#777",
    fontWeight: "600"
  },
  dayCountText: {
    padding: 6,
    color: "#777",
    fontSize: 14,
    fontWeight: "600"
  },
  invalidTime: {
    paddingTop: 3,
    height: INVALID_TIME_HEIGHT,
    marginHorizontal: 10
  },
  invalidTimeText: {
    fontSize: 12,
    fontWeight: "700",
    color: RED
  },
  instructionText: {
    marginTop: 5,
    marginHorizontal: 10,
    fontSize: 12,
    color: "#777"
  },
  timeOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    paddingLeft: 11
  },
  timeOverlayText: {
    fontSize: 14,
    color: "rgba(0,0,0,0.3)",
    fontWeight: "600"
  }
});
