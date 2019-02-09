import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Linking,
  Share
} from "react-native";
// import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { WIDTH } from "./Constants";
import emitter from "tiny-emitter/instance";

// const iconColor = "#000";

function call(source) {
  try {
    Linking.openURL(`tel:${source.phone}`);
  } catch (error) {
    console.log(error);
  }
}

function web(source) {
  try {
    Linking.openURL(source.website);
  } catch (error) {
    console.log(error);
  }
}

function hours() {
  emitter.emit("toggle-hours");
}

function go(source) {
  try {
    Linking.openURL(source.url);
  } catch (error) {
    console.log(error);
  }
}

async function share(doc) {
  const { _source: source, _id } = doc;
  const shareURL = `https://buncha.app/e/${_id}`;
  try {
    await Share.share({
      title: `${source.location}`,
      message: `${source.location} · ${source.city}\n${shareURL}`
    });
  } catch (error) {
    console.log(error);
  }
}

export default ({ doc }) => {
  return (
    <View style={styles.actions}>
      {["Hours", "Go", "Share", "Web", "Call"].map(text => {
        // let icon = null;
        let emoji = "";
        let onPress;
        switch (text) {
          case "Call":
            // icon = <Ionicons name="ios-call" size={24} color={iconColor} />;
            emoji = "📞";
            onPress = call.bind(null, doc._source);
            break;
          case "Web":
            // icon = (
            //   <MaterialIcons name="web-asset" size={24} color={iconColor} />
            // );
            emoji = "🔗";
            onPress = web.bind(null, doc._source);
            break;
          case "Hours":
            // icon = <Ionicons name="ios-time" size={21} color={iconColor} />;
            emoji = "🕘";
            onPress = hours;
            break;
          case "Go":
            // icon = (
            //   <MaterialIcons name="directions" size={23} color={iconColor} />
            // );
            emoji = "🚕";
            onPress = go.bind(null, doc._source);
            break;
          case "Share":
            // icon = (
            //   <Ionicons name="ios-share-alt" size={24} color={iconColor} />
            // );
            emoji = "📫";
            onPress = share.bind(null, doc);
            break;
          default:
            break;
        }
        return (
          <View key={text} style={styles.action}>
            <TouchableOpacity onPress={onPress} style={styles.btn}>
              <Text style={styles.icon}>{emoji}</Text>
              <Text style={styles.actionText}>{text}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 10
  },
  action: {
    width: (WIDTH - 30) / 5 - 8,
    backgroundColor: "#ededed",
    borderRadius: 5
  },
  btn: {
    flex: 1,
    paddingTop: 9,
    paddingBottom: 6,
    alignItems: "center"
  },
  icon: {
    fontSize: 18
  },
  actionText: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: "500",
    color: "#000"
  }
});
