import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { AWSCF } from "../utils/Constants";
import { itemSpans } from "../utils/Time";
import { getInset } from "../utils/SafeAreaInsets";
import SegmentedControl from "./SegmentedControl";
import Input from "./Input";
import PlanCalendarView from "./PlanCalendarView";

export default ({ plan, event: selectedEvent }) => {
  const event = selectedEvent || plan.event;

  const titleText = event._source.title;
  const locationText = event._source.location;
  const timeSpans = itemSpans(event);

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={{
            uri: event && `${AWSCF}${event._source.photos[0].thumb.key}`
          }}
          resizeMode="cover"
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.locationText}>{locationText}</Text>
          <Text style={styles.titleText}>{titleText}</Text>
          {timeSpans
            ? timeSpans.map(span => {
                return (
                  <Text key={span} style={styles.spanText}>
                    {span}
                  </Text>
                );
              })
            : null}
        </View>
      </View>
      <View style={{ paddingHorizontal: 15 }}>
        <PlanCalendarView />
        <Input
          placeholder="Time"
          containerStyle={{ marginTop: 10 }}
          returnKeyType="done"
        />
        <Text style={styles.timeText}>Formats like 7, 7a, 7:45pm are cool</Text>
        {plan ? (
          <SegmentedControl
            options={["Comments", "Invite"]}
            selected="Comments"
          />
        ) : (
          <Text style={styles.inviteText}>Invite</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  image: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    overflow: "hidden",
    backgroundColor: "#f2f2f2"
  },
  info: {
    paddingTop: getInset("top") + 60,
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  titleText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff"
  },
  locationText: {
    marginBottom: 2,
    fontSize: 16,
    color: "#fff"
  },
  spanText: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff"
  },
  timeText: {
    marginTop: 5,
    fontSize: 12,
    color: "#777"
  },
  inviteText: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#000"
  }
});
