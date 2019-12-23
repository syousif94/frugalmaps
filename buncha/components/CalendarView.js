import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  ScrollView
} from "react-native";
import moment from "moment";
import { BLUE, RED } from "../utils/Colors";
import _ from "lodash";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { formatTime, detruncateTime } from "../utils/Time";
import { Entypo } from "@expo/vector-icons";
import emitter from "tiny-emitter/instance";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

const rowHeight = 36;

export default ({
  event,
  expanded,
  style,
  singleDay = false,
  animatedValue = new Animated.Value(0),
  selected = new Set(),
  onSelect = id => {}
}) => {
  const [now, setNow] = useState(moment());

  let height = rowHeight * 6 + 10;
  if (singleDay) {
    height += 10;
  } else {
    height += 44 + 8;
  }
  const animation = useRef(animatedValue);

  const date = now.date();
  const year = now.year();
  const month = now.month();
  const todayISO = now.day();
  const monthDays = now.daysInMonth();
  const prevMonth = now.clone().subtract(1, "M");
  const prevMonthDays = prevMonth.daysInMonth();
  const nextMonth = now.clone().add(1, "M");
  const nextMonthDays = nextMonth.daysInMonth();

  const rows = [0, 1, 2, 3, 4].map(row =>
    [0, 1, 2, 3, 4, 5, 6].map(day => {
      const val = {
        day: date,
        month,
        year
      };
      if (!row && day < todayISO) {
        val.day = date - (todayISO - day);
        if (val.day <= 0) {
          val.day = prevMonthDays + val.day;
          val.month = prevMonth.month();
          val.year = prevMonth.year();
        }
        return val;
      }
      val.day = date + row * 7 + day - todayISO;
      if (val.day > monthDays) {
        val.day = val.day - monthDays;
        if (val.day > nextMonthDays) {
          val.day = val.day - nextMonthDays;
          const month = nextMonth.clone().add(1, "M");
          val.month = month.month();
          val.year = month.year();
        } else {
          val.month = nextMonth.month();
          val.year = nextMonth.year();
        }
      }
      return val;
    })
  );

  useEffect(() => {
    if (event) {
      animation.current.setValue(0);
      setNow(moment());
    }
  }, [event]);

  useEffect(() => {
    Animated.timing(
      animation.current,
      { toValue: expanded ? 1 : 0, duration: 150 },
      { useNativeDriver: true }
    ).start();
  }, [expanded]);

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

  let allowedDays;
  if (event) {
    const days = _.flattenDeep(
      event._source.groupedHours.map(group => group.days.map(day => day.iso))
    );
    allowedDays = new Set(days);
  }

  return (
    <Animated.View style={containerStyle}>
      <View style={{ paddingTop: 10 }}>
        <View style={styles.row}>
          {DAYS.map((day, index) => {
            const textStyle = [styles.dayNameText];
            const offDay = allowedDays && !allowedDays.has(index);
            const disabled = singleDay || offDay;
            if (offDay) {
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
        {rows.map((row, index) => {
          return (
            <View style={styles.row} key={`${index}`}>
              {row.map(({ day, month: m, year: y }, index) => {
                const dayTextStyle = [styles.dayText];
                const disabled =
                  (y <= year && m <= month && day < date) ||
                  (allowedDays && !allowedDays.has(index));

                const id = `${y}-${m + 1}-${day}`;

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
                const today = date === day && m === month && y === year;
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
                          backgroundColor: "rgba(0,0,0,0.05)"
                        }}
                      />
                    ) : null}
                    {day === 1 ? (
                      <Text style={styles.monthText}>{MONTHS[m]}</Text>
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
        {singleDay ? null : (
          <DateEditPicker selected={selected} event={event} />
        )}
      </View>
    </Animated.View>
  );
};

const DateEditButton = ({ id, event }) => {
  const animation = useRef(new Animated.Value(0));
  const dispatch = useDispatch();

  const selected = useSelector(state => {
    return state.interested.editingDate === id;
  }, shallowEqual);

  const timeText = useSelector(state => {
    return state.interested.selectedTimes[id];
  }, shallowEqual);

  let text;
  let iso;
  if (typeof id === "string") {
    const date = moment(id, ["Y-M-D"]);
    text = date.format("ddd M/D");
    iso = date.weekday();
  } else {
    text = DAYS[id];
    iso = id;
  }

  useEffect(() => {
    Animated.timing(
      animation.current,
      { toValue: selected ? 1 : 0, duration: 150 },
      { useNativeDriver: true }
    ).start(() => {
      if (selected) {
        emitter.emit("focus-interested");
      }
    });
  }, [selected]);

  let subtext;
  if (timeText) {
    subtext = detruncateTime(timeText);
  } else if (event) {
    const hours = event._source.groupedHours.find(group =>
      group.days.find(day => day.iso === iso)
    );
    subtext = formatTime(hours.start);
  }

  const iconStyle = {
    transform: [
      {
        rotate: animation.current.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"]
        })
      }
    ]
  };

  return (
    <View
      style={{
        margin: 2,
        borderRadius: 5,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: selected ? BLUE : "#fff"
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: "center",
          paddingLeft: 8,
          paddingRight: 5,
          flexDirection: "row"
        }}
        onPress={() => {
          if (selected) {
            emitter.emit("blur-interested");
            return;
          }
          dispatch({
            type: "interested/set",
            payload: {
              editingDate: selected ? null : id
            }
          });
        }}
      >
        <View style={{ marginRight: 5 }}>
          <Text style={{ fontSize: 10, fontWeight: "700", color: "#666" }}>
            {text}
          </Text>
          <Text style={{ fontSize: 12, color: "#333", fontWeight: "500" }}>
            {subtext}
          </Text>
        </View>
        <Animated.View style={iconStyle}>
          <Entypo name="chevron-small-down" size={14} color={BLUE} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const DateEditPicker = ({ selected, event }) => {
  const list = [...selected].map(id => (
    <DateEditButton key={id} event={event} id={id} />
  ));

  return (
    <View
      style={{
        height: 44,
        backgroundColor: "#f4f4f4",
        borderRadius: 8,
        marginTop: 8
      }}
    >
      {list.length ? (
        <ScrollView
          horizontal
          alwaysBounceHorizontal
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 2 }}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {list}
        </ScrollView>
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text style={{ color: "#999", fontSize: 12, fontWeight: "600" }}>
            Please select at least one date
          </Text>
        </View>
      )}
    </View>
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
    color: "#333",
    fontWeight: "600"
  },
  dayText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500"
  },
  monthText: {
    position: "absolute",
    top: -4,
    alignSelf: "center",
    fontSize: 10,
    fontWeight: "600",
    color: RED
  }
});
