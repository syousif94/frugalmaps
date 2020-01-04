import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Swiper from "react-native-swiper";
import { BLUE, RED } from "../utils/Colors";
import { navigate } from ".";
import { getInset } from "../utils/SafeAreaInsets";
import { HEIGHT } from "../utils/Constants";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";

export default () => {
  return (
    <View style={styles.container}>
      <Swiper
        loop={false}
        bounces
        renderPagination={(index, total) => {
          const dots = Array.apply(null, new Array(total)).map((_, i) => i);
          return (
            <View
              style={{
                position: "absolute",
                bottom: getInset("bottom"),
                alignSelf: "center",
                flexDirection: "row"
              }}
            >
              {dots.map(i => {
                return (
                  <View
                    key={`${i}`}
                    style={{
                      height: 6,
                      width: 6,
                      borderRadius: 3,
                      backgroundColor: index === i ? "#000" : "#ccc",
                      marginHorizontal: 2
                    }}
                  />
                );
              })}
            </View>
          );
        }}
      >
        <View style={styles.page}>
          <Text style={styles.titleText} allowFontScaling={false}>
            Welcome to Buncha
          </Text>
          <Text style={styles.subText} allowFontScaling={false}>
            Buncha is a curated social calendar featuring the best local happy
            hours, brunches, game nights, and more.
          </Text>
        </View>
        <View style={styles.page}>
          <Text style={styles.titleText} allowFontScaling={false}>
            Events
          </Text>
          <View style={{ flex: 1 }} />
          <View style={styles.subtitle}>
            <FontAwesome
              allowFontScaling={false}
              name="star"
              size={18}
              color={"#FFA033"}
            />
            <Text allowFontScaling={false} style={styles.subtitleText}>
              Interested
            </Text>
          </View>
          <Text allowFontScaling={false} style={styles.subText}>
            Contacts you've selected can see what you're interested in and when.
          </Text>
          <Text allowFontScaling={false} style={styles.subText}>
            Buncha also notifies you before events you're interested in.
          </Text>
          <View style={styles.subtitle}>
            <Entypo
              allowFontScaling={false}
              name="calendar"
              size={18}
              color={RED}
            />
            <Text allowFontScaling={false} style={styles.subtitleText}>
              Plans
            </Text>
          </View>
          <Text style={styles.subText} allowFontScaling={false}>
            Invite your friends and keep track of who's going. Works even if
            they don't have Buncha installed.
          </Text>
        </View>
        <View style={styles.page}>
          <Text style={styles.titleText} allowFontScaling={false}>
            Permissions
          </Text>
          <View style={{ flex: 1 }} />
          <View style={styles.subtitle}>
            <FontAwesome
              allowFontScaling={false}
              name="location-arrow"
              size={18}
              color={BLUE}
            />
            <Text allowFontScaling={false} style={styles.subtitleText}>
              Location
            </Text>
          </View>
          <Text style={styles.subText} allowFontScaling={false}>
            Used to determine which events are nearby.
          </Text>
          <View style={styles.subtitle}>
            <Ionicons
              allowFontScaling={false}
              name="md-notifications"
              size={20}
              color={BLUE}
            />
            <Text allowFontScaling={false} style={styles.subtitleText}>
              Notifications
            </Text>
          </View>
          <Text allowFontScaling={false} style={styles.subText}>
            Required for alerts.
          </Text>
        </View>
        <View style={styles.page}>
          <Text allowFontScaling={false} style={styles.titleText}>
            Account
          </Text>
          <View style={{ flex: 1 }} />
          <View style={{ backgroundColor: BLUE, borderRadius: 8 }}>
            <TouchableOpacity
              style={{
                height: 50,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                allowFontScaling={false}
                style={{ fontSize: 18, color: "#fff", fontWeight: "700" }}
              >
                Get Started
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  page: {
    paddingTop: getInset("top") + HEIGHT * 0.05,
    paddingBottom: getInset("bottom") + HEIGHT * 0.04,
    paddingHorizontal: 30,
    flex: 1
  },
  titleText: {
    fontSize: 25,
    fontWeight: "700"
  },
  subtitle: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center"
  },
  subtitleText: {
    marginLeft: 10,
    fontSize: 19,
    fontWeight: "600"
  },
  subText: {
    marginTop: 8,
    fontSize: 19,
    lineHeight: 26,
    color: "#666"
  }
});
