import React, { useRef, useContext, memo, useEffect } from "react";
import EventSearchInput from "./EventSearchInput";
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Text
} from "react-native";
import { itemMargin } from "./UpNextItem";
import _ from "lodash";
import { InputContext } from "./InputContext";
import { Ionicons } from "@expo/vector-icons";
import { BLUE } from "../utils/Colors";
import emitter from "tiny-emitter/instance";
import { PAGE } from "../store/filters";
import { useSafeArea } from "react-native-safe-area-context";
import { EXPOSED_LIST } from "./EventList";
import { Entypo } from "@expo/vector-icons";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as Filters from "../store/filters";
import TimeInput from "./TimeInput";
import BlurView from "./BlurView";

export default memo(({ scrollOffset }) => {
  const insets = useSafeArea();
  const inputRef = useRef(null);
  const [searchFocused, setSearchFocused] = useContext(InputContext);
  const clampRange = [
    0,
    Dimensions.get("window").height -
      EXPOSED_LIST -
      (44 + 15 + 38 + 44 + 8 + itemMargin) -
      insets.top
  ];
  return (
    <Animated.View
      style={{
        position: "absolute",
        flexDirection: "column-reverse",
        top: insets.top,
        left: itemMargin,
        right: itemMargin,
        padding: 5,
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 0
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        transform: [
          {
            translateY: scrollOffset.current.interpolate({
              inputRange: clampRange,
              outputRange: clampRange,
              extrapolate: "clamp"
            })
          }
        ]
      }}
    >
      <View
        style={{
          flexDirection: "row"
        }}
      >
        <View style={{ flex: 1, marginRight: 5 }}>
          <EventSearchInput
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
              overflow: "hidden"
            }}
            ref={inputRef}
            onFocus={() => {
              setSearchFocused(true);
            }}
            onBlur={() => {
              setSearchFocused(false);
            }}
          />
        </View>
        <MenuButton />
      </View>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 5
        }}
      >
        <DayPicker />
        <View
          style={{
            flex: 1,
            borderRadius: 6,
            backgroundColor: "rgba(180,180,180,0.1)"
          }}
        />
      </View>
    </Animated.View>
  );
});

const MenuButton = () => {
  return (
    <View
      style={{
        aspectRatio: 1,
        borderRadius: 5,
        backgroundColor: "rgba(180,180,180,0.1)"
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 3
        }}
        onPress={() => {
          requestAnimationFrame(() => {
            emitter.emit("filters", PAGE.WHEN);
          });
        }}
      >
        <Ionicons name="ios-menu" size={26} color={BLUE} />
      </TouchableOpacity>
    </View>
  );
};

const PICKER_BUTTON_HEIGHT = 36;
const PICKER_WIDTH = 150;

const DayPicker = () => {
  const open = useRef(false);
  const height = useRef(0);

  const pickerTransform = useRef(new Animated.Value(0));
  const daysTransform = useRef(new Animated.Value(0));

  const selectedDay = useSelector(state => state.filters.day, shallowEqual);

  const dispatch = useDispatch();
  const tag = useSelector(state => state.events.tag, shallowEqual);
  const occurringTags = useSelector(
    state => state.events.occurringTags,
    shallowEqual
  );
  const calendar = useSelector(
    state => state.events.calendar.sort((a, b) => a.iso - b.iso),
    shallowEqual
  );

  const closePickerAnimated = selectedDay => {
    const index = calendar.findIndex(day => day.title === selectedDay.title);
    if (index < 0) {
      return;
    }
    const toValue = (6 - index) * PICKER_BUTTON_HEIGHT;
    Animated.parallel([
      Animated.timing(
        daysTransform.current,
        { toValue, duration: 150 },
        { useNativeDriver: true }
      ),
      Animated.timing(
        pickerTransform.current,
        {
          toValue: PICKER_BUTTON_HEIGHT - height.current,
          duration: 150
        },
        { useNativeDriver: true }
      )
    ]).start(() => {
      open.current = false;
    });
  };

  useEffect(() => {
    if (open.current) {
      return;
    }

    const index = calendar.findIndex(day => day.title === selectedDay.title);

    if (index < 0) {
      return;
    }

    const toValue = (6 - index) * PICKER_BUTTON_HEIGHT;

    daysTransform.current.setValue(toValue);
  }, [calendar, selectedDay]);

  // useEffect(() => {
  //   if (open.current) {
  //     closePickerAnimated(selectedDay);
  //   }
  // }, [calendar, selectedDay]);

  let eventSet;
  if (tag) {
    const allTags = ["ending", "remaining", "upcoming"].reduce((ids, key) => {
      if (occurringTags[key] && occurringTags[key][tag]) {
        return [...ids, ...occurringTags[key][tag]];
      }

      return ids;
    }, []);
    eventSet = new Set(allTags);
  }

  return (
    <View
      style={{
        height: PICKER_BUTTON_HEIGHT,
        width: PICKER_WIDTH,
        marginRight: 5
      }}
      pointerEvents="box-none"
    >
      <View
        style={{
          position: "absolute",
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          top: 0,
          left: 0,
          right: 0,
          overflow: "hidden"
        }}
      >
        <Animated.View
          pointerEvents="box-none"
          style={{
            borderRadius: 6,
            overflow: "hidden",
            transform: [
              {
                translateY: pickerTransform.current
              }
            ]
          }}
        >
          <Animated.View
            pointerEvents="box-none"
            onLayout={e => {
              height.current = e.nativeEvent.layout.height;
              pickerTransform.current.setValue(
                PICKER_BUTTON_HEIGHT - height.current
              );
            }}
            style={{
              transform: [
                {
                  translateY: daysTransform.current
                }
              ]
            }}
          >
            <BlurView>
              {calendar.map(day => {
                let data = day.data;
                if (eventSet) {
                  data = data.filter(event => eventSet.has(event._id));
                }
                const eventCount = `${data.length}`;
                return (
                  <TouchableOpacity
                    key={day.title}
                    style={{
                      height: PICKER_BUTTON_HEIGHT,
                      flexDirection: "row",
                      alignItems: "center",
                      width: PICKER_WIDTH,
                      backgroundColor: "rgba(180,180,180,0.1)"
                    }}
                    onPress={() => {
                      if (open.current) {
                        dispatch(Filters.setDay(day));
                        closePickerAnimated(day);
                      } else {
                        open.current = true;
                        Animated.parallel([
                          Animated.timing(
                            pickerTransform.current,
                            {
                              toValue: 0,
                              duration: 150
                            },
                            { useNativeDriver: true }
                          ),
                          Animated.timing(
                            daysTransform.current,
                            {
                              toValue: 0,
                              duration: 150
                            },
                            { useNativeDriver: true }
                          )
                        ]).start();
                      }
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        paddingLeft: 7
                      }}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{
                          color: "#000",
                          fontSize: 14,
                          fontWeight: "600"
                        }}
                      >
                        {day.title}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{ color: "#777", fontSize: 12, marginTop: -2 }}
                      >
                        {daysAwayText(day.away)}
                      </Text>
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={{ color: "#777", fontSize: 14, marginRight: 20 }}
                    >
                      {eventCount}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </BlurView>
          </Animated.View>
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 5,
            top: 0,
            height: PICKER_BUTTON_HEIGHT,
            justifyContent: "center",
            opacity: pickerTransform.current.interpolate({
              inputRange: [
                Math.min(-1, PICKER_BUTTON_HEIGHT - height.current),
                0
              ],
              outputRange: [1, 0]
            })
          }}
        >
          <Entypo
            name="chevron-up"
            color={BLUE}
            size={11}
            style={{ marginBottom: -5 }}
          />
          <Entypo name="chevron-down" color={BLUE} size={11} />
        </Animated.View>
      </View>
    </View>
  );
};

function daysAwayText(away) {
  switch (away) {
    case 0:
      return "Today";
    case 1:
      return "Tomorrow";
    default:
      return `${away} days away`;
  }
}
