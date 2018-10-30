import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Text
} from "react-native";
import { connect } from "react-redux";

import { withNavigation } from "react-navigation";
import { Entypo } from "@expo/vector-icons";

import * as Events from "./store/events";

const ImageGallery = ({ doc, height, set, navigation }) => {
  const { _source: item } = doc;

  return (
    <View>
      <ScrollView style={[styles.images, { height }]} horizontal>
        <TouchableWithoutFeedback
          onPress={() => {
            set({
              selectedEvent: {
                data: doc
              }
            });
            navigation.navigate("Info");
          }}
        >
          <View
            style={{
              height,
              flexDirection: "row"
            }}
          >
            {item.photos.map(photo => {
              const { url: uri, height: imageHeight, width } = photo;

              const source = {
                uri
              };

              const imageWidth = (height / imageHeight) * width;

              return (
                <Image
                  key={uri}
                  source={source}
                  style={[styles.image, { width: imageWidth, height }]}
                />
              );
            })}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <View pointerEvents="none" style={styles.action}>
        <Entypo name="info-with-circle" size={16} color="#fff" />
        {height < 200 ? null : (
          <Text style={[styles.actionText, { color: "#fff" }]}>More Info</Text>
        )}
      </View>
    </View>
  );
};

export default connect(
  null,
  {
    set: Events.actions.set
  }
)(withNavigation(ImageGallery));

const styles = StyleSheet.create({
  images: {
    backgroundColor: "#f2f2f2"
  },
  image: {
    resizeMode: "contain",
    backgroundColor: "#e0e0e0",
    marginRight: 2
  },
  action: {
    position: "absolute",
    bottom: 6,
    right: 6,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 6,
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 4
  },
  actionText: {
    marginLeft: 8,
    fontWeight: "600"
  }
});
