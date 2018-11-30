import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  Text
} from "react-native";
import { connect } from "react-redux";
import _ from "lodash";

import { withNavigation } from "react-navigation";
import { Entypo } from "@expo/vector-icons";

import * as Events from "./store/events";

class ImageGallery extends Component {
  shouldComponentUpdate(next) {
    return next.doc._id !== this.props.doc._id;
  }

  _renderItem = ({ item, section, index }) => {
    const { height, set, navigation, disabled, doc } = this.props;
    const { url: uri, height: imageHeight, width } = item;

    const source = {
      uri
    };

    const imageWidth = (height / imageHeight) * width;

    return (
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
        <Image
          key={uri}
          source={source}
          style={[styles.image, { width: imageWidth, height }]}
        />
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const {
      doc,
      height,
      narrow,
      disabled,
      backgroundColor = "#f2f2f2"
    } = this.props;

    const { _source: item } = doc;

    const touchableStyle = {
      height
    };

    const photos = _(item.photos)
      .shuffle()
      .value();

    let data = [];

    let i = 0;

    while (i < 50) {
      data = [...data, ...photos];
      i++;
    }

    const imagesStyle = {
      height,
      backgroundColor
    };

    return (
      <View>
        <View style={imagesStyle} horizontal>
          <View style={touchableStyle}>
            <FlatList
              style={touchableStyle}
              data={data}
              renderItem={this._renderItem}
              keyExtractor={(item, i) => item.url + i}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
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
    fontWeight: "600",
    color: "#fff"
  }
});
