import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated
} from "react-native";
import moment from "moment";
import { BLUE } from "../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const rowHeight = 36;
const height = rowHeight * 8 + 10;

export default ({
  event,
  expanded,
  style,
  singleDay = false,
  animatedValue = new Animated.Value(0)
}) => {
  const now = useRef(moment());

  const [month, setMonth] = useState(moment());

  const [selected, setSelected] = useState(new Set());

  const animation = useRef(animatedValue);

  let startDate = month
    .clone()
    .date(1)
    .day();
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

  if (rows[4][6] && rows[4][6] < daysInMonth) {
    rows.push(
      [0, 1, 2, 3, 4, 5, 6].map(day => {
        const val = 5 * 7 + day + 1 - startDate;
        if (val < 0 || val > daysInMonth) {
          return null;
        }
        return val;
      })
    );
  }

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
      setSelected(new Set());
    }
  }, [event]);

  const containerStyle = [
    styles.container,
    style,
    {
      height: animation.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0, height]
      })
    }
  ];

  const onPrevMonth = () => {
    const prevMonth = month.clone().subtract(1, "M");
    setMonth(prevMonth);
  };

  const onLongPrevMonth = () => {
    setMonth(now.current);
  };

  const onNextMonth = () => {
    const nextMonth = month.clone().add(1, "M");
    setMonth(nextMonth);
  };

  const sameMonth =
    month.month() <= now.current.month() && month.year() <= now.current.year();

  const onSelect = id => {
    if (selected.has(id)) {
      selected.delete(id);
    } else {
      if (singleDay) {
        setSelected(new Set([id]));
        return;
      }
      selected.add(id);
    }
    setSelected(new Set(selected));
  };

  let allowedDays;
  if (event) {
    const days = _.flattenDeep(
      event._source.groupedHours.map(group => group.days.map(day => day.iso))
    );
    allowedDays = new Set(days);
  }

  return (
    <Animated.View style={containerStyle}>
      <View style={{ height, paddingTop: 10 }}>
        <View style={styles.month}>
          <TouchableOpacity
            style={styles.prevMonthButton}
            onPress={onPrevMonth}
            onLongPress={onLongPrevMonth}
            disabled={sameMonth}
          >
            <Ionicons
              style={{ marginTop: 1 }}
              name="ios-arrow-back"
              color={sameMonth ? "#ccc" : BLUE}
              size={16}
            />
          </TouchableOpacity>
          <Text style={[styles.boldText, { alignSelf: "center" }]}>
            {month.format("MMMM Y")}
          </Text>
          <TouchableOpacity
            style={styles.nextMonthButton}
            onPress={onNextMonth}
          >
            <Ionicons
              style={{ marginTop: 1 }}
              name="ios-arrow-forward"
              color={BLUE}
              size={16}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          {DAYS.map((day, index) => {
            const textStyle = [styles.dayNameText];
            const disabled =
              singleDay || (allowedDays && !allowedDays.has(index));
            if (!singleDay && disabled) {
              textStyle.push({
                color: "rgba(0,0,0,0.1)"
              });
            }
            if (selected.has(index)) {
              textStyle.push({
                color: BLUE
              });
            }
            return (
              <View style={styles.day} key={day}>
                <TouchableOpacity
                  onPress={onSelect.bind(null, index)}
                  style={styles.dayBtn}
                  disabled={disabled}
                >
                  <Text style={textStyle}>{day}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        {rows.map(row => {
          return (
            <View style={styles.row} key={`${row}`}>
              {row.map((day, index) => {
                const dayTextStyle = [styles.dayText];
                const disabled =
                  (sameMonth && day < date) ||
                  (allowedDays && !allowedDays.has(index));

                const id = `${month.year()}-${month.month()}-${day}`;

                const isSelected = selected.has(id) || selected.has(index);
                if (isSelected) {
                  dayTextStyle.push({
                    color: BLUE,
                    fontWeight: "700"
                  });
                }
                if (disabled) {
                  dayTextStyle.push({
                    color: "rgba(0,0,0,0.1)"
                  });
                }
                const today = sameMonth && date === day;
                return (
                  <View style={styles.day} key={`${index}`}>
                    {today ? (
                      <View
                        style={{
                          position: "absolute",
                          height: rowHeight,
                          width: rowHeight,
                          borderRadius: rowHeight / 2,
                          alignSelf: "center",
                          backgroundColor: "rgba(0,0,0,0.02)"
                        }}
                      />
                    ) : null}
                    {day ? (
                      <TouchableOpacity
                        style={styles.dayBtn}
                        disabled={disabled}
                        onPress={onSelect.bind(null, id)}
                      >
                        <Text style={dayTextStyle}>{day}</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden"
  },
  month: {
    height: rowHeight,
    flexDirection: "row"
  },
  prevMonthButton: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 15
  },
  nextMonthButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 15
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
  dayNameText: {
    fontSize: 10,
    color: "rgba(0,0,0,0.4)",
    fontWeight: "600"
  },
  dayText: {
    fontSize: 14,
    color: "rgba(0,0,0,0.4)",
    fontWeight: "500"
  }
});
