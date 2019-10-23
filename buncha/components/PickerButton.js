import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { PAGE, resetTime } from "../store/filters";
import { BLUE } from "../utils/Colors";
import { Entypo } from "@expo/vector-icons";
import moment from "moment";
import { WEB } from "../utils/Constants";
import _ from "lodash";

const TouchableOpacity = WEB
  ? require("react-native").TouchableOpacity
  : require("react-native-gesture-handler/touchables/TouchableOpacity").default;

const buttonHeight = WEB ? 36 : 44;

const TimePicker = () => {
  const dispatch = useDispatch();
  const now = useSelector(state => state.events.now);
  const time = moment(now);
  const value = time.format("ddd h:mma");
  return (
    <PickerButton
      title={PAGE.WHEN}
      value={value}
      onPress={() => {
        dispatch(resetTime());
      }}
    />
  );
};

const PlacePicker = () => {
  const value = useSelector(state => {
    const city = state.events.city;
    const locationEnabled = state.permissions.location;
    const locationText =
      city && city.text.length
        ? city.text.split(",")[0]
        : locationEnabled || locationEnabled === null
        ? "Locating"
        : "Everywhere"
    return locationText;
  });

  return <PickerButton title={PAGE.WHERE} value={value} />;
};

const TagPicker = () => {
  const value = useSelector(state => _.startCase(state.events.tag || "All"));

  return <PickerButton title={PAGE.TYPE} value={value} />;
};

export { TimePicker, PlacePicker, TagPicker, buttonHeight };

const PickerButton = ({ title, value, onPress: pressHandler }) => {
  const dispatch = useDispatch();
  const onPress = () => {
    if (pressHandler) {
      pressHandler();
    }
    dispatch({
      type: "filters/set",
      payload: {
        page: title
      }
    });
  };
  return (
    <TouchableOpacity style={styles.pickerBtn} onPress={onPress}>
      <View style={styles.pickerInfo}>
        <Text allowFontScaling={false} style={styles.pickerTitleText}>
          {title}
        </Text>
        <Text allowFontScaling={false} style={styles.pickerValueText}>
          {value}
        </Text>
      </View>
      <PickerIcon />
    </TouchableOpacity>
  );
};

export default PickerButton;

const PickerIcon = () => {
  return (
    <View
      style={{
        alignItems: "center",
        marginRight: 8,
        marginLeft: 3
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
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(180,180,180,0.1)",
    marginHorizontal: 2.5,
    borderRadius: 6
  },
  buttonText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#777"
  },
  pickerInfo: {
    paddingHorizontal: 8,
    justifyContent: "space-between",
    height: buttonHeight,
    paddingVertical: WEB ? 3 : 5
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