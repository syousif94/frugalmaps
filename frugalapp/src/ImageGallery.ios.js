import React, { Component } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import { AWSCF } from "./Constants";
import emitter from "tiny-emitter/instance";

class ImageGallery extends Component {
  shouldComponentUpdate(next) {
    return (
      next.doc._id !== this.props.doc._id ||
      next.paddingTop !== this.props.paddingTop
    );
  }

  _onPress = () => {
    const { doc } = this.props;

    emitter.emit("fit-marker", doc);
  };

  _renderItem = ({ item }) => {
    const { height } = this.props;

    if (!item.thumb) {
      return null;
    }

    let uri = `${AWSCF}${item.thumb.key}`;
    let imageHeight = item.thumb.height;
    let width = item.thumb.width;

    const source = {
      uri
    };

    const imageWidth = (height / imageHeight) * width;

    return (
      <View key={uri} style={[styles.photo, { height }]}>
        <ActivityIndicator style={styles.loader} size="small" color="#000" />
        <Image
          key={uri}
          source={source}
          style={{
            width: imageWidth,
            height
          }}
        />
      </View>
    );
  };

  _keyExtractor = (item, index) => {
    if (item.thumb) {
      return `${item.thumb.key}${index}`;
    } else {
      return `${item.url}${index}`;
    }
  };

  render() {
    const {
      doc,
      height,
      narrow,
      disabled,
      backgroundColor = "#f2f2f2",
      horizontal = true
    } = this.props;

    const { _source: item } = doc;

    const touchableStyle = {
      height
    };

    const photos = item.photos;

    const spacer = { url: "spacer" };

    let data = [];

    let i = 0;

    while (i < 50) {
      if (horizontal) {
        data = [...data, ...photos];
      } else {
        data = [...data, spacer, ...photos];
      }
      i++;
    }

    const imagesStyle = {
      height,
      backgroundColor
    };

    return (
      <View>
        <View style={imagesStyle}>
          <View style={touchableStyle}>
            <FlatList
              horizontal
              style={touchableStyle}
              data={data}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        <View style={styles.actions}>
          <Icon onPress={this._onPress} disabled={disabled} narrow={narrow} />
        </View>
      </View>
    );
  }
}

const Icon = ({ disabled, narrow, onPress = null }) => {
  if (narrow || disabled) {
    return null;
  }
  return (
    <View style={styles.action}>
      <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
        <FontAwesome name="map-marker" size={14} color="#fff" />
        <Text style={styles.actionText}>Zoom In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImageGallery;

const styles = StyleSheet.create({
  photo: {
    backgroundColor: "#fff",
    marginRight: 2
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#e0e0e0"
  },
  actions: {
    position: "absolute",
    bottom: 3,
    right: 3,
    flexDirection: "row"
  },
  action: {
    margin: 3,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 6
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 4
  },
  actionText: {
    fontSize: 14,
    marginLeft: 5,
    fontWeight: "600",
    color: "#fff"
  }
});
