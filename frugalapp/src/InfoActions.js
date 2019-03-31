import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Linking,
  Share
} from "react-native";
import { SMS } from "expo";

import { WIDTH } from "./Constants";

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
    const canSMS = SMS.isAvailableAsync();
    if (canSMS) {
      await SMS.sendSMSAsync([], `${shareURL}`);
      return;
    }
    await Share.share({
      title: `${source.location}`,
      message: `${shareURL}`
    });
  } catch (error) {
    console.log(error);
  }
}

export default ({ doc }) => {
  return (
    <View style={styles.actions}>
      {["Call", "Web", "Go"].map(text => {
        let onPress;
        switch (text) {
          case "Call":
            onPress = call.bind(null, doc._source);
            break;
          case "Web":
            onPress = web.bind(null, doc._source);
            break;
          case "Go":
            onPress = go.bind(null, doc._source);
            break;
          case "Share":
            onPress = share.bind(null, doc);
            break;
          default:
            break;
        }
        return (
          <View key={text} style={styles.action}>
            <TouchableOpacity onPress={onPress} style={styles.btn}>
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
    marginBottom: 10
  },
  action: {
    width: (WIDTH - 25) / 3 - 8,
    backgroundColor: "#ededed",
    borderRadius: 5
  },
  btn: {
    flex: 1,
    paddingTop: 6,
    paddingBottom: 6,
    alignItems: "center"
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000"
  }
});
