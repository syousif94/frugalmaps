import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated
} from "react-native";
import { DAYS } from "../utils/Constants";
import moment from "moment";

const rowHeight = 36;
const height = rowHeight * 7 + 10;

export default ({ event, expanded }) => {
  const now = useRef(moment());

  const [month, setMonth] = useState(moment());

  const [selected, setSelected] = useState(new Set());

  const animation = useRef(new Animated.Value(0));

  let startDate =
    month
      .clone()
      .date(1)
      .day() - 1;
  if (startDate < 0) {
    startDate = 6;
  }
  const daysInMonth = month.daysInMonth();
  const date = month.date();

  const rows = [0, 1, 2, 3, 4].map(row =>
    [0, 1, 2, 3, 4, 5, 6].map(day => {
      const val = row * 7 + day + 1 - startDate;
      if (val < 0 || val > daysInMonth) {
        return null;
      }
      return val;
    })
  );

  useEffect(() => {
    Animated.timing(
      animation.current,
      { toValue: expanded ? 1 : 0, duration: 150 },
      { useNativeDriver: true }
    ).start();
  }, [expanded]);

  useEffect(() => {
    if (event) {
      animation.current.setValue(0);
      now.current = moment();
    }
  }, [event]);

  const containerStyle = [
    styles.container,
    {
      height: animation.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0, height]
      })
    }
  ];

  return (
    <Animated.View style={containerStyle}>
      <View style={styles.month}>
        <Text style={styles.boldText}>{month.format("MMMM Y")}</Text>
      </View>
      <View style={styles.row}>
        {DAYS.map(day => {
          return (
            <View style={styles.day} key={day}>
              <TouchableOpacity style={styles.dayBtn}>
                <Text style={styles.boldText}>{day}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      {rows.map(row => {
        return (
          <View style={styles.row} key={`${row}`}>
            {row.map((day, index) => {
              const dayStyle = [styles.dayText];
              if (date === day) {
                dayStyle.push({
                  fontWeight: "600"
                });
              } else if (day < date) {
                dayStyle.push({
                  color: "#aaa"
                });
              }
              return (
                <View style={styles.day} key={`${index}`}>
                  {day ? (
                    <TouchableOpacity
                      style={styles.dayBtn}
                      disabled={day < date}
                    >
                      <Text style={dayStyle}>{day}</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })}
          </View>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#fff"
  },
  month: {
    marginTop: 10,
    height: rowHeight,
    justifyContent: "center",
    alignItems: "center"
  },
  row: {
    flexDirection: "row",
    height: rowHeight
  },
  day: {
    flex: 1
  },
  dayBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  boldText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600"
  },
  dayText: {
    fontSize: 14,
    color: "#000"
  }
});
