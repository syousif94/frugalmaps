import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { AWSCF, ANDROID, WEB, IOS } from "../utils/Constants";
import { itemSpans } from "../utils/Time";
import { getInset } from "../utils/SafeAreaInsets";
import SegmentedControl from "./SegmentedControl";
import Input from "./Input";
import PlanCalendarView from "./PlanCalendarView";
import { useDimensions } from "../utils/Hooks";
import { getHistory, navigate, pop } from "../screens";
import { Entypo, Feather } from "@expo/vector-icons";

export default ({ plan, event: selectedEvent }) => {
  const [dimensions] = useDimensions();

  const event = selectedEvent || plan.event;

  const titleText = event._source.title;
  const locationText = event._source.location;
  const timeSpans = itemSpans(event);

  let headerStyle = null;
  if (dimensions.width > 500) {
    headerStyle = {
      marginTop: 15,
      marginHorizontal: 15,
      borderRadius: 8,
      overflow: "hidden"
    };
  }

  return (
    <View style={styles.container}>
      <View style={headerStyle}>
        <Image
          source={{
            uri: event && `${AWSCF}${event._source.photos[0].thumb.key}`
          }}
          resizeMode="cover"
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.locationText}>{locationText}</Text>
          <Text style={styles.titleText}>{titleText}</Text>
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
                    <Text style={styles.spanText}>{span.days}</Text>
                    <Text style={styles.spanText}>{span.hours}</Text>
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>
        <BackButton />
        <MoreButton event={event} />
      </View>
      <View style={{ paddingHorizontal: 15 }}>
        <PlanCalendarView event={event} />
        <Input
          placeholder="Enter a Time"
          containerStyle={{ marginTop: 10 }}
          returnKeyType="done"
        />
        <Text style={styles.timeText}>
          Formats like 7, 7a, and 7:45pm are cool
        </Text>
        {plan ? (
          <SegmentedControl
            options={["Comments", "Invite"]}
            selected="Comments"
          />
        ) : (
          <Text style={styles.inviteText}>Invite</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
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
    paddingTop: getInset("top") + 60,
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  titleText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff"
  },
  locationText: {
    marginBottom: 2,
    fontSize: 16,
    color: "#fff"
  },
  spanText: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff"
  },
  timeText: {
    marginTop: 5,
    fontSize: 12,
    color: "#777"
  },
  inviteText: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#000"
  }
});

const BackButton = () => {
  if (ANDROID) {
    return null;
  }
  const onPress = () => {
    if (WEB) {
      const history = getHistory();
      if (history) {
        if (history.length > 2) {
          history.goBack();
        } else {
          navigate("UpNext");
        }
      }
    } else {
      pop();
    }
  };
  return (
    <View
      style={{
        position: "absolute",
        top: IOS ? getInset("top") + 6 : 6,
        left: 6,
        height: 30,
        width: 30
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Entypo name="chevron-left" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const MoreButton = ({ event }) => {
  const onPress = () => {
    navigate("Detail", { id: event._id });
  };
  return (
    <View
      style={{
        position: "absolute",
        bottom: 6,
        right: 4,
        height: 30,
        width: 30
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Feather name="more-vertical" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
