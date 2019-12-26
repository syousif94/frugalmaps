import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated
} from "react-native";
import { navigate } from "../screens";
import { selectPlaceEvents } from "../store/events";
import { itemRemaining } from "../utils/Time";
import { useAnimateOn } from "../utils/Hooks";
import { topBarHeight } from "./TopBar";
import ImageGallery from "./ImageGallery";
import DaysText from "./DaysText";

const height = 165;

export default () => {
  const selectedEvent = useSelector(state => {
    const selected = state.events.selected;
    if (!selected) {
      return null;
    }
    return state.events.data[selected];
  }, shallowEqual);

  const [event, transform] = useAnimateOn(selectedEvent);

  const events = useSelector(selectPlaceEvents(event), shallowEqual);

  const eventCount = `${events.length} event${events.length !== 1 ? "s" : ""}`;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.slider,
          {
            opacity: transform.current,
            transform: [
              {
                translateY: transform.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-height, 0]
                })
              }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (!event) {
              return;
            }
            navigate("Detail", { id: event._id });
          }}
        >
          {!event ? null : (
            <View style={{ flex: 1 }}>
              <ImageGallery
                photos={event._source.photos.slice(0, 6)}
                height={60}
              />
              <View
                style={{ flex: 1, paddingVertical: 5, paddingHorizontal: 10 }}
              >
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 16, fontWeight: "700", color: "#000" }}
                  allowFontScaling={false}
                >
                  {event._source.location}{" "}
                </Text>
                <Text
                  style={{ fontSize: 13 }}
                  numberOfLines={1}
                  allowFontScaling={false}
                >
                  <Text style={{ color: "#666", fontWeight: "700" }}>
                    {eventCount}
                  </Text>
                  <Text style={{ color: "#aaa" }}>
                    {" "}
                    {event._source.address}
                  </Text>
                </Text>
                {events.map((e, index) => {
                  const time = itemRemaining(e);
                  let nameText = e._source.title;
                  return (
                    <View style={{ marginTop: 3 }} key={`${index}`}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#000"
                        }}
                        numberOfLines={1}
                        allowFontScaling={false}
                      >
                        {nameText}
                        <Text style={{ color: time.color, fontWeight: "700" }}>
                          {" "}
                          {time.text}{" "}
                        </Text>
                        <DaysText days={event._source.days} />
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "500",
                          color: "#666",
                          marginTop: 1
                        }}
                        numberOfLines={1}
                        allowFontScaling={false}
                      >
                        {event._source.description}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: topBarHeight,
    left: 0,
    right: 0,
    height,
    overflow: "hidden"
  },
  slider: {
    flex: 1,
    marginHorizontal: 8,
    marginTop: 4,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  button: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden"
  },
  row: {
    flexDirection: "row",
    flex: 1
  }
});
