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
import { AWSCF, ANDROID, WEB } from "../utils/Constants";
import { selectPlaceEvents } from "../store/events";
import { itemRemaining } from "../utils/Time";
import { useAnimateOn } from "../utils/Hooks";
import { topBarHeight } from "./TopBar";

let tabBarHeight;
if (!WEB) {
  tabBarHeight = require("./TabBar").tabBarHeight;
}

const height = 84;
const imageHeight = height - 30;

export default () => {
  const selectedEvent = useSelector(state => {
    const selected = state.events.selected;
    if (!selected) {
      return null;
    }
    return state.events.data[selected];
  });

  const [event, transform] = useAnimateOn(selectedEvent);

  const events = useSelector(selectPlaceEvents(event));

  // const eventCount = events.length;

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
                <Text
                  numberOfLines={2}
                  style={{ fontSize: 12, marginTop: 2, color: "#000" }}
                >
                  {events.map((e, index) => {
                    const time = itemRemaining(e);
                    const dotText = index === 0 ? "" : " · ";
                    let nameText = `${dotText}${e._source.title} `;
                    return (
                      <React.Fragment key={`${index}`}>
                        <Text>{nameText}</Text>
                        <Text style={{ color: time.color, fontWeight: "600" }}>
                          {time.text}
                        </Text>
                      </React.Fragment>
                    );
                  })}
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
    flex: 1
  },
  row: {
    flexDirection: "row",
    flex: 1
  },
  image: {
    height: imageHeight,
    width: imageHeight,
    backgroundColor: "#f2f2f2",
    marginLeft: 9,
    borderRadius: 4,
    alignSelf: "center"
  }
});
