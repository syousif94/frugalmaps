import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { PAGE, resetTime } from "../store/filters";
import { BLUE } from "../utils/Colors";
import { Entypo } from "@expo/vector-icons";
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
  const place = useSelector(state => {
    const city = state.events.city;
    const locationEnabled = state.permissions.location;
    const locationText =
      city && city.text.length
        ? city.text.split(",")[0]
        : locationEnabled || locationEnabled === null
        ? "Locating"
        : "Everywhere";
    return locationText;
  });
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
      <View
        style={[
          styles.pickerInfo,
          { borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }
        ]}
      >
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          <Text allowFontScaling={false} style={styles.pickerTitleText}>
            {PAGE.WHEN}
          </Text>
          <Text allowFontScaling={false} style={styles.pickerValueText}>
            {time}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.pickerInfo,
          {
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6
          }
        ]}
      >
        <View style={{ flex: 1, paddingLeft: 3, paddingRight: 10 }}>
          <Text allowFontScaling={false} style={styles.pickerTitleText}>
            {PAGE.WHERE}
          </Text>
          <Text allowFontScaling={false} style={styles.pickerValueText}>
            {place}
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
        marginRight: 10
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
    marginHorizontal: 2.5
  },
  buttonText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#777"
  },
  pickerInfo: {
    backgroundColor: "rgba(180,180,180,0.1)",
    flexDirection: "row",
    alignItems: "center",
    height: buttonHeight
  },
  pickerTitleText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#777"
  },
  pickerValueText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000"
  }
});
