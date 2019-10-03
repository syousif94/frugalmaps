import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";
import { getInset } from "../utils/SafeAreaInsets";
import { useSelector, useDispatch } from "react-redux";
import { IOS } from "../utils/Constants";
import { navigate } from "../screens";
import { BLUE } from "../utils/Colors";
import { Ionicons, FontAwesome, EvilIcons, Entypo } from "@expo/vector-icons";
import moment from "moment";
import BlurView from "./BlurView";
import { PAGE } from "../store/filters";

const width = Dimensions.get("window").width;

let bottomInset = IOS ? getInset("bottom") : 0;

if (bottomInset === 0) {
  bottomInset = 5;
} else if (bottomInset > 25) {
  bottomInset -= 10;
}

const buttonHeight = 44;
const topPadding = 5;
const topBorderWidth = 1;

const tabBarHeight = bottomInset + buttonHeight + topPadding + topBorderWidth;

export { tabBarHeight };

export default ({ navigation }) => {
  const {
    state: { index, routes }
  } = navigation;

  const routeKey = routes[index] && routes[index].key;

  return (
    <BlurView style={styles.container}>
      <ScrollView
        centerContent={width > 600}
        contentContainerStyle={{
          paddingTop: topPadding,
          paddingHorizontal: 2.5,
          paddingBottom: bottomInset
        }}
        style={{
          borderTopWidth: topBorderWidth,
          borderColor: "rgba(0,0,0,0.05)"
        }}
        horizontal
        alwaysBounceHorizontal
        showsHorizontalScrollIndicator={false}
      >
        {routeKey === "UpNext" ? null : (
          <TouchableOpacity
            style={styles.roundBtn}
            onPress={() => {
              navigate("UpNext");
            }}
          >
            <EvilIcons name="calendar" size={28} color={BLUE} />
            <Text
              allowFontScaling={false}
              style={[styles.buttonText, { marginTop: -3 }]}
            >
              List
            </Text>
          </TouchableOpacity>
        )}

        {routeKey === "Map" ? null : (
          <TouchableOpacity
            style={styles.roundBtn}
            onPress={() => {
              navigate("Map");
            }}
          >
            <FontAwesome name="map-o" size={16} color={BLUE} />
            <Text
              allowFontScaling={false}
              style={[styles.buttonText, { marginTop: 3 }]}
            >
              Map
            </Text>
          </TouchableOpacity>
        )}

        {routeKey === "Account" ? null : (
          <TouchableOpacity
            style={styles.roundBtn}
            onPress={() => {
              navigate("Account");
            }}
          >
            <FontAwesome name="user-o" size={16} color={BLUE} />
            <Text
              allowFontScaling={false}
              style={[styles.buttonText, { marginTop: 3 }]}
            >
              Friends
            </Text>
          </TouchableOpacity>
        )}

        <PickerButton title={PAGE.TYPE} value="All" />

        <TimePicker />

        <PlacePicker />

        <TouchableOpacity
          style={styles.roundBtn}
          onPress={() => {
            navigate("Submit");
          }}
        >
          <Ionicons name="ios-add-circle-outline" size={18} color={BLUE} />
          <Text allowFontScaling={false} style={styles.buttonText}>
            Add
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </BlurView>
  );
};

const TimePicker = () => {
  const now = useSelector(state => state.events.now);
  const time = moment(now);
  const value = time.format("ddd h:mma");
  return <PickerButton title={PAGE.WHEN} value={value} />;
};

const PlacePicker = () => {
  const value = useSelector(state => {
    const city = state.events.city;
    const locationEnabled = state.permissions.location;
    const locationText =
      city && city.text.length
        ? city.text.split(",")[0]
        : locationEnabled
        ? "Locating"
        : "Everywhere";
    return locationText;
  });

  return <PickerButton title={PAGE.WHERE} value={value} />;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0
  },
  roundBtn: {
    height: buttonHeight,
    minWidth: buttonHeight,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 5,
    borderRadius: 6,
    backgroundColor: "rgba(180,180,180,0.1)",
    marginHorizontal: 2.5
  },
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
    paddingVertical: 5
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
  },
  selected: {
    color: BLUE
  }
});

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

const PickerButton = ({ title, value }) => {
  const dispatch = useDispatch();
  const onPress = () => {
    requestAnimationFrame(() => {
      dispatch({
        type: "filters/set",
        payload: {
          page: title
        }
      });
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
