import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import moment from "moment";

export default class CalendarView extends Component {
  static rows = [0, 1, 2, 3, 4, 5];
  static days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  render() {
    const today = moment();

    const dayIndex = today.day();
    const dateIndex = today.date();
    const daysInMonth = today.daysInMonth();
    const startOfMonth = today.clone().startOf("month");
    const startingDayIndex = startOfMonth.day();

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          {CalendarView.days.map((day, index) => {
            const today = index === dayIndex;
            return (
              <View
                key={day}
                style={[styles.dayName, today ? styles.selectedDayName : null]}
              >
                <Text
                  style={[
                    styles.dayText,
                    today ? styles.selectedDayText : null
                  ]}
                >
                  {day}
                </Text>
              </View>
            );
          })}
        </View>
        {CalendarView.rows.map(row => {
          return (
            <View key={`${row}`} style={styles.row}>
              {CalendarView.days.map((_, day) => {
                const dayOfMonth = row * 7 + day - startingDayIndex + 1;
                if (dayOfMonth < 1 || dayOfMonth > daysInMonth) {
                  return <View key={`${day}`} style={[styles.dayName]} />;
                }
                const today = dayOfMonth === dateIndex;
                return (
                  <TouchableOpacity key={`${day}`} style={[styles.dayName]}>
                    <Text
                      style={[
                        styles.dateText,
                        today ? styles.selectedDateText : null
                      ]}
                    >
                      {dayOfMonth}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
  },
  dayName: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1
  },
  selectedDayName: {},
  dayText: {
    fontSize: 12,
    color: "#777"
  },
  selectedDayText: {
    color: "#000",
    fontWeight: "700"
  },
  row: {
    borderBottomWidth: 0.5,
    borderColor: "#e0e0e0",
    flexDirection: "row"
  },
  dateText: {
    fontSize: 16,
    color: "#000"
  },
  selectedDateText: {
    fontWeight: "700"
  }
});
