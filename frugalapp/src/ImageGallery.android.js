import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";

import { withNavigation } from "react-navigation";
import { Entypo } from "@expo/vector-icons";
import Swiper from "react-native-swiper";

import * as Events from "./store/events";
import { WIDTH, AWSCF } from "./Constants";

class ImageGallery extends Component {
  shouldComponentUpdate(next) {
    return next.doc._id !== this.props.doc._id;
  }

  _onPress = () => {
    const { set, navigation, doc } = this.props;

    set({
      selectedEvent: {
        data: doc
      }
    });
    navigation.navigate("Info");
  };

  render() {
    const { doc, height, disabled, width: galleryWidth, narrow } = this.props;

    const { _source: item } = doc;

    const width = galleryWidth || WIDTH;

    const containerStyle = {
      height,
      width
    };

    return (
      <View style={containerStyle}>
        <TouchableWithoutFeedback disabled={disabled} onPress={this._onPress}>
          <Swiper loadMinimal loop height={height} width={width}>
            {item.photos.map(photo => {
              if (!photo.thumb) {
                return null;
              }

              let uri = `${AWSCF}${photo.thumb.key}`;
              // let imageHeight = item.thumb.height;
              // let width = item.thumb.width;

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
            })}
          </Swiper>
        </TouchableWithoutFeedback>
        <Icon onPress={this._onPress} disabled={disabled} narrow={narrow} />
      </View>
    );
  }
}

const Icon = ({ disabled, narrow, onPress }) => {
  if (disabled) {
    return null;
  }
  return (
    <View pointerEvents="none" style={styles.action}>
      <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
        <Entypo name="info-with-circle" size={16} color="#fff" />
        {narrow ? null : <Text style={styles.actionText}>More Info</Text>}
        <Entypo
          style={styles.chevron}
          name="chevron-right"
          size={18}
          color="#fff"
        />
      </TouchableOpacity>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 6
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 7,
    paddingRight: 4,
    paddingVertical: 4
  },
  actionText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#fff"
  },
  chevron: {
    marginLeft: -1
  }
});
