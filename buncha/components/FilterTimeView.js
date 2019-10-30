import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Picker
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { PAGE } from "../store/filters";
import { getInset } from "../utils/SafeAreaInsets";

const HOURS = [];
for (let i = 0; i < 12; i++) {
  HOURS.push(i + 1);
}

const MINUTES = [];
for (let i = 0; i < 60; i++) {
  MINUTES.push(i);
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const TimePicker = () => {
  const dispatch = useDispatch();
  const day = useSelector(state => state.filters.day);
  const hour = useSelector(state => state.filters.hour);
  const minutes = useSelector(state => state.filters.minutes);
  const meridian = useSelector(state => state.filters.meridian);
  const setValue = key => val => {
    dispatch({
      type: "filters/set",
      payload: {
        [key]: val
      }
    });
  };
  return (
    <View style={styles.timeContainer}>
      <Picker
        selectedValue={day}
        style={[styles.timePicker, { flex: 2 }]}
        onValueChange={setValue("day")}
        itemStyle={{ textAlign: "left" }}
      >
        {DAYS.map(val => (
          <Picker.Item key={val} label={`   ${val}`} value={val} />
        ))}
      </Picker>
      <Picker
        selectedValue={hour}
        style={styles.timePicker}
        onValueChange={setValue("hour")}
      >
        {HOURS.map(val => (
          <Picker.Item key={`${val}`} label={`${val}`} value={val} />
        ))}
      </Picker>
      <Picker
        selectedValue={minutes}
        style={styles.timePicker}
        onValueChange={setValue("minutes")}
      >
        {MINUTES.map(val => {
          const key = `${val}`;
          const label = val < 10 ? `0${val}` : `${val}`;
          return <Picker.Item key={key} label={label} value={val} />;
        })}
      </Picker>
      <Picker
        selectedValue={meridian}
        onValueChange={setValue("meridian")}
        style={styles.meridianPicker}
      >
        {["AM", "PM"].map(val => (
          <Picker.Item key={val} label={val} value={val} />
        ))}
      </Picker>
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: "40%",
          justifyContent: "center"
        }}
        pointerEvents="none"
      >
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#000",
            marginBottom: 1
          }}
        >
          :
        </Text>
      </View>
    </View>
  );
};

export default ({ page }) => {
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
      <Text style={styles.titleText}>{PAGE.WHEN}</Text>
      <TimePicker />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    paddingBottom: getInset("bottom") + 10
  },
  titleText: {
    marginTop: 12,
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
    fontWeight: "700"
  },
  dayContainer: {
    marginTop: 15
  },
  dayContent: {
    paddingHorizontal: 5,
    paddingVertical: 2.5
  },
  dayButton: {
    marginHorizontal: 5,
    marginVertical: 2.5,
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 14,
    justifyContent: "center"
  },
  dayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(0,0,0,0.5)"
  },
  timeContainer: {
    flexDirection: "row"
  },
  timePicker: {
    height: "100%",
    flex: 1
  },
  meridianPicker: {
    height: "100%",
    flex: 1
  }
});
