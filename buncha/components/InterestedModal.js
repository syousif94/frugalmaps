import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Animated,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { AWSCF, HEIGHT } from "../utils/Constants";
import emitter from "tiny-emitter/instance";
import { BLUE } from "../utils/Colors";
import SegmentedControl from "./SegmentedControl";
import Input from "./Input";
import { useKeyboardHeight } from "../utils/Hooks";
import CalendarView from "./CalendarView";
import { itemSpans } from "../utils/Time";

export default () => {
  const [event, setEvent] = useState(null);
  const [mode, setMode] = useState("Always");
  const animation = useRef(new Animated.Value(0));
  const [keyboard, bottomOffset] = useKeyboardHeight();
  useEffect(() => {
    const handleEvent = event => {
      if (event) {
        setEvent(event);
        setMode("Always");
        Animated.timing(
          animation.current,
          { toValue: 1, duration: 150 },
          { useNativeDriver: true }
        ).start();
      } else {
        Animated.timing(
          animation.current,
          { toValue: 0, duration: 150 },
          { useNativeDriver: true }
        ).start(() => {
          setEvent(null);
        });
      }
    };

    emitter.on("interested", handleEvent);

    return () => emitter.off("interested", handleEvent);
  }, [event]);
  const containerStyle = [
    styles.container,
    {
      opacity: animation.current,
      transform: [
        {
          translateY: keyboard.current
        }
      ]
    }
  ];
  const modalStyle = [
    styles.modal,
    {
      transform: [
        {
          translateY: animation.current.interpolate({
            inputRange: [0, 1],
            outputRange: [60, 0]
          })
        }
      ]
    }
  ];
  const pointerEvents = event ? "auto" : "none";
  const onLayout = e => {
    const modalHeight = e.nativeEvent.layout.height;
    bottomOffset.current = (HEIGHT - modalHeight) / -2 - 58;
  };
  return (
    <Animated.View style={containerStyle} pointerEvents={pointerEvents}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        alwaysBounceVertical
      >
        <Animated.View style={modalStyle} onLayout={onLayout}>
          <EventHeader event={event} />
          <View style={{ paddingHorizontal: 15 }}>
            <Text style={styles.titleText}>Interested</Text>
            <SegmentedControl
              options={["Always", "Dates", "Never"]}
              selected={mode}
              onPress={option => {
                setMode(option);
              }}
            />
            <CalendarView expanded={mode === "Dates"} event={event} />
            <Input
              placeholder="Time"
              containerStyle={{ marginTop: 10 }}
              returnKeyType="done"
            />
            <Text style={styles.timeText}>
              Time is optional, formats like 7, 7a, 7:45pm are cool
            </Text>
            <View style={styles.actions}>
              <View style={styles.cancelButton}>
                <TouchableOpacity
                  onPress={() => {
                    emitter.emit("interested", null);
                  }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.saveButton}>
                <TouchableOpacity style={styles.button}>
                  <Text style={[styles.buttonText, { color: "#fff" }]}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </Animated.View>
  );
};

const EventHeader = ({ event }) => {
  const titleText = event ? event._source.title : null;
  const locationText = event ? event._source.location : null;
  const timeSpans = event && itemSpans(event);
  return (
    <View style={headerStyles.container}>
      <Image
        source={{
          uri: event && `${AWSCF}${event._source.photos[0].thumb.key}`
        }}
        resizeMode="cover"
        style={headerStyles.image}
      />
      <View style={headerStyles.info}>
        <Text style={headerStyles.titleText}>{titleText}</Text>
        {timeSpans
          ? timeSpans.map(span => {
              return (
                <Text key={span} style={headerStyles.spanText}>
                  {span}
                </Text>
              );
            })
          : null}
        <Text style={headerStyles.locationText}>{locationText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    minHeight: "100%",
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    width: 306,
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden"
  },
  titleText: {
    marginBottom: 8,
    fontSize: 14,
    color: "#000",
    fontWeight: "600"
  },
  timeText: {
    marginTop: 5,
    marginBottom: 20,
    fontSize: 12,
    color: "#777"
  },
  actions: {
    height: 44,
    flexDirection: "row",
    marginBottom: 10
  },
  cancelButton: {
    marginRight: 4,
    flex: 1
  },
  saveButton: {
    marginLeft: 4,
    flex: 1,
    backgroundColor: BLUE,
    borderRadius: 8
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: BLUE,
    fontSize: 14,
    fontWeight: "700"
  }
});

const headerStyles = StyleSheet.create({
  container: {
    marginBottom: 8
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
    paddingLeft: 15,
    paddingTop: 25,
    paddingBottom: 10,
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  titleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff"
  },
  locationText: {
    marginTop: 2,
    fontSize: 14,
    color: "#fff"
  },
  spanText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: "#fff"
  }
});
