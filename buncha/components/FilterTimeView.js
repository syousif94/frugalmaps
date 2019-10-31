import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { PAGE } from "../store/filters";
import { BLUE, RED } from "../utils/Colors";
import Input from "./Input";
import * as Filters from "../store/filters";
import * as Events from "../store/events";
import { WEB } from "../utils/Constants";

export default ({ page }) => {
  const dispatch = useDispatch();
  const isPage = page === PAGE.WHEN;
  const pointerEvents = isPage ? "auto" : "none";
  const calendar = useSelector(state => state.events.calendar);
  const selectedDay = useSelector(state => state.filters.day);
  const selectedTime = useSelector(state => state.filters.time);
  const validTime = useSelector(state => state.filters.validTime);
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
              <Text style={styles.subText}>Find events by time and day</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                dispatch(Filters.resetTime());
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Now</Text>
            </TouchableOpacity>
          </View>
        </View>
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
        <Text style={styles.instructionText}>
          {validTime ? null : (
            <Text style={styles.invalidTimeText}>Invalid Time... </Text>
          )}
          Time is optional, formats like 7, 11a, and 10:43pm are cool,{" "}
          <Text style={{ fontWeight: "700" }}>pm</Text> assumed
        </Text>
        <Input
          value={selectedTime}
          spellCheck={false}
          autoCorrect={WEB ? "off" : false}
          autoCapitalize="none"
          placeholder="Time"
          containerStyle={{ marginHorizontal: 10, marginTop: 5 }}
          backgroundColor="rgba(0,0,0,0.04)"
          style={{ fontWeight: "600" }}
          onChangeText={text => {
            dispatch(Filters.setTime(text));
          }}
        />
        <TouchableOpacity
          style={[
            styles.button,
            {
              width: 250,
              alignSelf: "center",
              marginTop: 35,
              backgroundColor: validTime ? BLUE : "#ccc"
            }
          ]}
          disabled={!validTime}
          onPress={() => {
            dispatch(Events.getTime());
          }}
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

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
  invalidTimeText: {
    fontWeight: "700",
    color: RED
  },
  instructionText: {
    marginTop: 5,
    marginHorizontal: 10,
    fontSize: 12,
    color: "#777"
  }
});
