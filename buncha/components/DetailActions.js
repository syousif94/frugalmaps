import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Linking,
  TouchableOpacity
} from "react-native";
import Link from "./Link";
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";
import { RED, BLUE, NOW } from "../utils/Colors";
import { WEB, ANDROID } from "../utils/Constants";
import { getHistory, navigate, pop } from "../screens";

export default ({ item }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.scrollContent}
      >
        <BackButton />
        <Link
          style={[styles.link]}
          onPress={() => {
            Linking.openURL(`tel:${item._source.phone}`);
          }}
        >
          <FontAwesome
            style={{ marginTop: 1 }}
            name="phone"
            size={14}
            color={NOW}
          />
          <Text style={[styles.titleText, { marginLeft: 6 }]}>Call</Text>
        </Link>
        <Link
          to={item._source.website}
          style={styles.link}
          onPress={() => {
            if (WEB) {
              window.open(item._source.website, "_blank");
            } else {
              Linking.openURL(item._source.website);
            }
          }}
        >
          <Entypo
            style={{ marginTop: 1.5 }}
            name="link"
            size={14}
            color={BLUE}
          />
          <Text style={[styles.titleText, { marginLeft: 6 }]}>Website</Text>
        </Link>
        <Link
          style={styles.link}
          onPress={() => {
            if (WEB) {
              window.open(item._source.url, "_blank");
            } else {
              Linking.openURL(item._source.url);
            }
          }}
        >
          <FontAwesome name="map-marker" size={14} color={RED} />
          <Text style={[styles.titleText, { marginLeft: 8 }]}>Google Maps</Text>
        </Link>
      </ScrollView>
    </View>
  );
};

const BackButton = () => {
  if (ANDROID) {
    return null;
  }
  const onPress = () => {
    if (WEB) {
      const history = getHistory();
      history.pop("UpNext");
    } else {
      pop();
    }
  };
  return (
    <View style={styles.back}>
      <TouchableOpacity onPress={onPress} style={styles.backButton}>
        <Ionicons
          style={{ marginTop: 1 }}
          name="ios-arrow-back"
          color={BLUE}
          size={16}
        />
        <Text style={[styles.titleText, { marginLeft: 8 }]}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: WEB ? "center" : null,
    maxWidth: WEB ? 500 : null
  },
  scrollContent: {
    paddingHorizontal: 6,
    paddingVertical: 10
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600"
  },
  link: {
    borderRadius: 8,
    marginHorizontal: 4,
    paddingLeft: 10,
    paddingRight: 8,
    backgroundColor: "#f4f4f4",
    height: 28,
    flexDirection: "row",
    alignItems: "center"
  },
  back: {
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: "#f4f4f4",
    height: 28
  },
  backButton: {
    height: 28,
    paddingLeft: 10,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center"
  }
});
