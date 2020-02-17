import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { PAGE, resetTime } from "../store/filters";
import { BLUE } from "../utils/Colors";
import { WEB } from "../utils/Constants";
import _ from "lodash";
import emitter from "tiny-emitter/instance";
import { searchTimeSelector, getTime } from "../store/events";

const TouchableOpacity = WEB
  ? require("react-native").TouchableOpacity
  : require("react-native-gesture-handler/touchables/TouchableOpacity").default;

const buttonHeight = WEB ? 36 : 44;

export { buttonHeight };

export default () => {
  const dispatch = useDispatch();
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
        <Text allowFontScaling={false} style={styles.pickerTitleText}>
          {PAGE.WHEN}
        </Text>
        <Text allowFontScaling={false} style={styles.pickerValueText}>
          {time}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pickerBtn: {
    flexDirection: "row",
    overflow: "hidden",
    marginLeft: 2
  },
  buttonText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#777"
  },
  pickerInfo: {
    backgroundColor: "rgba(180,180,180,0.1)",
    justifyContent: "center",
    height: buttonHeight,
    paddingHorizontal: 8,
    borderRadius: 4
  },
  pickerTitleText: {
    fontSize: 10,
    fontWeight: "500",
    color: BLUE
  },
  pickerValueText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000"
  }
});
