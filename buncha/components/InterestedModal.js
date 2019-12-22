import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
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
import { BLUE } from "../utils/Colors";
import SegmentedControl from "./SegmentedControl";
import { useKeyboardHeight, useAnimateOn } from "../utils/Hooks";
import CalendarView from "./CalendarView";
import { itemSpans } from "../utils/Time";
import TimeInput from "./TimeInput";
import * as Interested from "../store/interested";

export default () => {
  const dispatch = useDispatch();
  const selectedEvent = useSelector(
    state => state.interested.event,
    shallowEqual
  );
  const mode = useSelector(state => state.interested.mode, shallowEqual);
  const selectedDays = useSelector(state => state.interested.selected);
  const selectedDate = useSelector(state => state.interested.selectedDate);

  const expandedTimeInput =
    mode === Interested.MODES[0] ||
    (mode === Interested.MODES[1] && selectedDate);

  const [event, animation] = useAnimateOn(selectedEvent);

  const [keyboard, bottomOffset] = useKeyboardHeight();

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
            <Text style={styles.titleText}>When are you interested?</Text>
            <SegmentedControl
              options={Interested.MODES}
              selected={mode}
              onPress={option => {
                dispatch({
                  type: "interested/set",
                  payload: {
                    mode: option
                  }
                });
              }}
            />
            <CalendarView
              expanded={mode === "Dates"}
              event={event}
              selected={selectedDays}
              onSelect={id => {
                dispatch(Interested.select({ id }));
              }}
            />
            <TimeInputView expanded={expandedTimeInput} />
            <View style={styles.actions}>
              <View style={styles.cancelButton}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch({
                      type: "interested/set",
                      payload: {
                        event: null
                      }
                    });
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

const TimeInputView = ({ expanded }) => {
  const dispatch = useDispatch();
  const value = useSelector(Interested.getTime);
  const onChangeText = text => {
    dispatch(Interested.setTime({ text }));
  };
  const [height, setHeight] = useState(0);
  const animation = useRef(new Animated.Value(0));
  useEffect(() => {
    const toValue = expanded ? height : 0;
    Animated.timing(
      animation.current,
      { toValue, duration: 150 },
      { useNativeDriver: true }
    ).start();
  }, [expanded, height]);

  const inputStyle = {
    marginTop: 10,
    height: !height ? null : animation.current,
    overflow: "hidden"
  };
  return (
    <Animated.View
      style={inputStyle}
      onLayout={e => {
        if (!height) {
          setHeight(e.nativeEvent.layout.height);
        }
      }}
    >
      <TimeInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Time"
        returnKeyType="done"
      />
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
        <Text style={headerStyles.locationText}>{locationText}</Text>
        <Text style={headerStyles.titleText}>{titleText}</Text>

        {timeSpans ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            {timeSpans.map((span, i) => {
              return (
                <View key={`${i}`} style={{ marginRight: 15 }}>
                  <Text style={headerStyles.spanText}>{span.days}</Text>
                  <Text style={headerStyles.spanText}>{span.hours}</Text>
                </View>
              );
            })}
          </View>
        ) : null}
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
    paddingHorizontal: 15,
    paddingTop: 25,
    paddingBottom: 10,
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  titleText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff"
  },
  locationText: {
    marginBottom: 2,
    fontSize: 14,
    color: "#fff"
  },
  spanText: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "700",
    color: "#fff"
  }
});
