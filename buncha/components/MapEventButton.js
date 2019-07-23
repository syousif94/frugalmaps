import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  Image
} from "react-native";
import { navigate } from "../screens";
import { Entypo } from "@expo/vector-icons";
import { AWSCF, ANDROID } from "../utils/Constants";

const height = 60;

export default () => {
  const selectedEvent = useSelector(state => {
    const selected = state.events.selected;
    if (!selected) {
      return null;
    }
    return state.events.data[selected];
  });

  const [event, setEvent] = useState(null);

  const transform = useRef(new Animated.Value(0));

  useEffect(() => {
    if (event !== selectedEvent) {
      let toValue;

      if (selectedEvent && !event) {
        toValue = 1;
      } else if (event && !selectedEvent) {
        toValue = 0;
      }

      if (selectedEvent && toValue) {
        setEvent(selectedEvent);
      }

      if (toValue !== undefined) {
        requestAnimationFrame(() => {
          Animated.timing(
            transform.current,
            { toValue, duration: 150 },
            { useNativeDriver: true }
          ).start(() => {
            if (!toValue) {
              setEvent(selectedEvent);
            }
          });
        });
      } else if (ANDROID && selectedEvent) {
        setEvent(selectedEvent);
      }
    }
  }, [selectedEvent, event]);

  const eventCount = useSelector(state =>
    event ? state.events.places[event._source.placeid].length : null
  );

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.slider,
          {
            transform: [
              {
                translateY: transform.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height, 0]
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
            <View style={styles.row}>
              <Image
                source={{ uri: `${AWSCF}${event._source.photos[0].thumb.key}` }}
                style={styles.image}
                resizeMode="cover"
              />
              <View
                style={{ flex: 1, justifyContent: "center", paddingLeft: 8 }}
              >
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 14, fontWeight: "600", color: "#000" }}
                >
                  {event._source.location}{" "}
                  <Text
                    style={{ fontSize: 12, fontWeight: "600", color: "#888" }}
                  >
                    {event._source.city}
                  </Text>
                </Text>
                <Text style={{ fontSize: 12, marginTop: 2, color: "#000" }}>
                  {eventCount} event{eventCount !== 1 ? "s" : ""}
                </Text>
              </View>
              <View style={{ paddingHorizontal: 8, justifyContent: "center" }}>
                <Entypo name="chevron-right" size={22} color="#ccc" />
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
    bottom: 0,
    left: 0,
    right: 0,
    height
  },
  slider: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    flex: 1,
    backgroundColor: "#fff"
  },
  button: {
    flex: 1
  },
  row: {
    flexDirection: "row",
    flex: 1
  },
  image: {
    height: 50,
    width: 50,
    backgroundColor: "#f2f2f2",
    marginLeft: 5,
    borderRadius: 2,
    alignSelf: "center"
  }
});
