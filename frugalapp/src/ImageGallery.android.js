import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Text
} from "react-native";
import { connect } from "react-redux";
import _ from "lodash";

import { withNavigation } from "react-navigation";
import { Entypo } from "@expo/vector-icons";
import Swiper from "react-native-swiper";

import * as Events from "./store/events";
import { WIDTH } from "./Constants";

class ImageGallery extends Component {
  shouldComponentUpdate(next) {
    return next.doc._id !== this.props.doc._id;
  }

  render() {
    const {
      doc,
      height,
      set,
      navigation,
      disabled,
      width: galleryWidth,
      narrow
    } = this.props;

    const { _source: item } = doc;

    const width = galleryWidth || WIDTH;

    const containerStyle = {
      height,
      width
    };

    return (
      <View style={containerStyle}>
        <TouchableWithoutFeedback
          disabled={disabled}
          onPress={() => {
            set({
              selectedEvent: {
                data: doc
              }
            });
            navigation.navigate("Info");
          }}
        >
          <Swiper loadMinimal loop height={height} width={width}>
            {_(item.photos)
              .shuffle()
              .map(photo => {
                const { url: uri } = photo;

                const source = {
                  uri
                };

                // const imageWidth = (height / imageHeight) * width;

                // const imageWidth = width;

                return (
                  <View key={uri} style={styles.imageContainer}>
                    <Image
                      source={source}
                      style={[styles.image, { width, height }]}
                    />
                  </View>
                );
              })
              .value()}
          </Swiper>
        </TouchableWithoutFeedback>
        <Icon disabled={disabled} narrow={narrow} />
      </View>
    );
  }
}

const Icon = ({ disabled, narrow }) => {
  if (disabled) {
    return null;
  }
  return (
    <View pointerEvents="none" style={styles.action}>
      <Entypo name="info-with-circle" size={16} color="#fff" />
      {narrow ? null : <Text style={styles.actionText}>More Info</Text>}
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
  imageContainer: {
    flex: 1,
    backgroundColor: "#e0e0e0"
  },
  image: {
    resizeMode: "cover",
    backgroundColor: "#e0e0e0"
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
    fontWeight: "600",
    color: "#fff"
  }
});
