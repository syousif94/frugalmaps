import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { MOBILE_WEB, IOS_WEB, ANDROID_WEB } from "../utils/Constants";
import { Entypo } from "@expo/vector-icons";
import { BLUE } from "../utils/Colors";

export default () => {
  if (!MOBILE_WEB) return null;

  const onPress = () => {
    if (IOS_WEB) {
      window.open(
        "https://itunes.apple.com/us/app/buncha-local-calendar/id1440536868?ls=1&mt=8"
      );
    } else if (ANDROID_WEB) {
      window.open(
        "https://play.google.com/store/apps/details?id=me.syousif.LitCal"
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Icon />
        <View style={{ flex: 1, paddingVertical: 5 }}>
          <Text style={styles.titleText}>Get the app</Text>
          <Text style={styles.subtext}>
            It's faster and has more features like a friend feed and a map
          </Text>
        </View>
        <View
          style={{ justifyContent: "center", paddingRight: 12, paddingLeft: 5 }}
        >
          <Entypo name="chevron-right" size={16} color={BLUE} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Icon = () => {
  if (IOS_WEB) {
    return (
      <View
        style={{
          justifyContent: "center",
          marginHorizontal: 15,
          paddingBottom: 2
        }}
      >
        <svg width="22" height="26" xmlns="http://www.w3.org/2000/svg">
          <g fill="#000" fill-rule="nonzero">
            <path d="M18.128 13.784c-.029-3.223 2.639-4.791 2.761-4.864-1.511-2.203-3.853-2.504-4.676-2.528-1.967-.207-3.875 1.177-4.877 1.177-1.022 0-2.565-1.157-4.228-1.123-2.14.033-4.142 1.272-5.24 3.196-2.266 3.923-.576 9.688 1.595 12.859 1.086 1.553 2.355 3.287 4.016 3.226 1.625-.067 2.232-1.036 4.193-1.036 1.943 0 2.513 1.036 4.207.997 1.744-.028 2.842-1.56 3.89-3.127 1.255-1.78 1.759-3.533 1.779-3.623-.041-.014-3.387-1.291-3.42-5.154zM14.928 4.306c.874-1.093 1.472-2.58 1.306-4.089-1.265.056-2.847.875-3.758 1.944-.806.942-1.526 2.486-1.34 3.938 1.421.106 2.88-.717 3.792-1.793z" />
          </g>
        </svg>
      </View>
    );
  } else if (ANDROID_WEB) {
    return (
      <View
        style={{
          justifyContent: "center",
          marginHorizontal: 15
        }}
      >
        <svg
          height="26"
          viewBox="0 0 926 1032"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              x1="61.03%"
              y1="4.95%"
              x2="26.463%"
              y2="71.926%"
              id="a"
            >
              <stop stop-color="#00A0FF" offset="0%" />
              <stop stop-color="#00A1FF" offset=".657%" />
              <stop stop-color="#00BEFF" offset="26.01%" />
              <stop stop-color="#00D2FF" offset="51.22%" />
              <stop stop-color="#00DFFF" offset="76.04%" />
              <stop stop-color="#00E3FF" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="107.63%"
              y1="50%"
              x2="-130.552%"
              y2="50%"
              id="b"
            >
              <stop stop-color="#FFE000" offset="0%" />
              <stop stop-color="#FFBD00" offset="40.87%" />
              <stop stop-color="orange" offset="77.54%" />
              <stop stop-color="#FF9C00" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="86.243%"
              y1="30.904%"
              x2="-50.129%"
              y2="136.019%"
              id="c"
            >
              <stop stop-color="#FF3A44" offset="0%" />
              <stop stop-color="#C31162" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="-18.811%"
              y1="-11.825%"
              x2="42.085%"
              y2="35.087%"
              id="d"
            >
              <stop stop-color="#32A071" offset="0%" />
              <stop stop-color="#2DA771" offset="6.85%" />
              <stop stop-color="#15CF74" offset="47.62%" />
              <stop stop-color="#06E775" offset="80.09%" />
              <stop stop-color="#00F076" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="none" fill-rule="evenodd">
            <path
              d="M18.3 15.794C6.7 28.294 0 47.394 0 72.394v886.7c0 25 6.7 44.1 18.7 56.1l3.1 2.7 496.8-496.8v-11.1L21.4 13.094l-3.1 2.7z"
              fill="url(#a)"
              transform="translate(.1 .306)"
            />
            <path
              d="M683.9 687.194l-165.7-165.7v-11.6l165.7-165.7 3.6 2.2 196 111.4c56.1 31.6 56.1 83.8 0 115.8l-196 111.4-3.6 2.2z"
              fill="url(#b)"
              transform="translate(.1 .306)"
            />
            <path
              d="M687.5 684.994l-169.3-169.3-499.9 499.9c18.3 19.6 49 21.8 83.3 2.7l585.9-333.3"
              fill="url(#c)"
              transform="translate(.1 .306)"
            />
            <path
              d="M687.5 346.394l-585.9-332.8c-34.3-19.6-65.1-16.9-83.3 2.7l499.9 499.4 169.3-169.3z"
              fill="url(#d)"
              transform="translate(.1 .306)"
            />
            <path
              d="M684 681.7l-581.9 330.6c-32.5 18.7-61.5 17.4-80.2.4l-3.1 3.1 3.1 2.7c18.7 16.9 47.7 18.3 80.2-.4L688 685.3l-4-3.6z"
              fill="#000"
              fill-rule="nonzero"
              opacity=".2"
            />
            <path
              d="M883.6 568.1L683.5 681.7l3.6 3.6 196-111.4c28.1-16 41.9-37 41.9-57.9-1.7 19.2-16 37.4-41.4 52.1z"
              fill="#000"
              fill-rule="nonzero"
              opacity=".12"
            />
            <path
              d="M101.7 19.7l781.9 444.2c25.4 14.3 39.7 33 41.9 52.1 0-20.9-13.8-41.9-41.9-57.9L101.7 13.9C45.6-18.2.1 8.6.1 72.7v5.8C.1 14.3 45.6-12 101.7 19.7z"
              fill="#FFF"
              opacity=".25"
            />
          </g>
        </svg>
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    marginTop: 8,
    marginHorizontal: 8,
    backgroundColor: "#f4f4f4",
    borderWidth: 0.5,
    borderColor: "#e0e0e0"
  },
  button: {
    flexDirection: "row"
  },
  titleText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500"
  },
  subtext: {
    fontSize: 12,
    color: "#444",
    marginTop: 1
  }
});
