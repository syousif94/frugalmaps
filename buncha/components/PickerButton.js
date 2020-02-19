import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { PAGE, resetTime } from "../store/filters";
import { BLUE } from "../utils/Colors";
import { WEB, ANDROID } from "../utils/Constants";
import _ from "lodash";
import emitter from "tiny-emitter/instance";
import { Entypo } from "@expo/vector-icons";
import { searchTimeSelector, getTime } from "../store/events";

const TouchableOpacity = WEB
  ? require("react-native").TouchableOpacity
  : require("react-native-gesture-handler/touchables/TouchableOpacity").default;

export const buttonHeight = 36;

export default () => {
  const dispatch = useDispatch();
  const locationText = useSelector(state =>
    state.events.city ? state.events.city.text.split(",")[0] : "Locating"
  );
  const time = useSelector(searchTimeSelector);
  const onPress = () => {
    requestAnimationFrame(() => {
      emitter.emit("filters", PAGE.WHEN);
    });
  };
  const onLongPress = () => {
    requestAnimationFrame(() => {
      dispatch(resetTime());
      dispatch(getTime());
    });
  };
  return (
    <TouchableOpacity
      style={styles.pickerBtn}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.pickerInfo}>
        <View>
          <Text allowFontScaling={false} style={styles.pickerTitleText}>
            {locationText}
          </Text>
          <Text allowFontScaling={false} style={styles.pickerValueText}>
            {time}
          </Text>
        </View>
        <PickerIcon />
      </View>
    </TouchableOpacity>
  );
};

const PickerIcon = () => {
  return (
    <View
      style={{
        alignItems: "center",
        marginLeft: 8
      }}
    >
      <Entypo name="chevron-up" size={10} color={BLUE} />
      <Entypo
        name="chevron-down"
        size={10}
        color={BLUE}
        style={{ marginTop: -1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pickerBtn: {
    flexDirection: "row",
    overflow: "hidden",
    marginLeft: 2
  },
  pickerInfo: {
    backgroundColor: "rgba(180,180,180,0.1)",
    flexDirection: "row",
    height: buttonHeight,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    borderRadius: 3
  },
  pickerTitleText: {
    fontSize: 12,
    fontWeight: ANDROID ? "700" : "600",
    color: "#777"
  },
  pickerValueText: {
    marginTop: ANDROID ? -3 : -1,
    fontSize: 12,
    fontWeight: ANDROID ? "700" : "600",
    color: "#555"
  }
});
