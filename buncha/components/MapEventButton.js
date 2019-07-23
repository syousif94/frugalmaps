import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated
} from "react-native";
import { navigate } from "../screens";

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
      }
    }
  }, [selectedEvent, event]);

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
            <React.Fragment>
              <Text>{event._source.title}</Text>
            </React.Fragment>
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
  }
});
