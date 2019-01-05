import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  Text,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import _ from "lodash";

import { withNavigation } from "react-navigation";
import { Entypo } from "@expo/vector-icons";
import { WIDTH } from "./Constants";
import EventList from "./InfoEventList";

import * as Events from "./store/events";

class ImageGallery extends Component {
  shouldComponentUpdate(next) {
    return (
      next.doc._id !== this.props.doc._id ||
      next.paddingTop !== this.props.paddingTop
    );
  }

  _renderItem = ({ item }) => {
    const {
      height,
      set,
      navigation,
      disabled,
      doc,
      horizontal = true
    } = this.props;

    const { url: uri, height: imageHeight, width } = item;

    const source = {
      uri
    };

    if (horizontal) {
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
          <View key={uri} style={[styles.photo, { height }]}>
            <ActivityIndicator
              style={styles.loader}
              size="large"
              color="#000"
            />
            <Image
              key={uri}
              source={source}
              style={[
                styles.image,
                {
                  width: imageWidth,
                  height
                }
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    } else if (uri === "spacer") {
      return (
        <View style={styles.info}>
          <EventList placeid={doc._source.placeid} />
        </View>
      );
    } else {
      const height = (WIDTH / width) * imageHeight;

      const backgroundColor = "#444";

      return (
        <View key={uri} style={[styles.vPhoto, { backgroundColor }]}>
          <ActivityIndicator style={styles.loader} size="large" color="#000" />
          <Image
            key={uri}
            source={source}
            style={[styles.vImage, { width: WIDTH, height }]}
          />
        </View>
      );
    }
  };

  render() {
    const {
      doc,
      height,
      narrow,
      disabled,
      backgroundColor = "#f2f2f2",
      horizontal = true,
      paddingTop
    } = this.props;

    const { _source: item } = doc;

    const touchableStyle = {
      height
    };

    const photos = _(item.photos)
      .shuffle()
      .value();

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

    if (horizontal) {
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
                keyExtractor={(item, i) => item.url + i}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
          <Icon disabled={disabled} narrow={narrow} />
        </View>
      );
    } else {
      if (paddingTop === null) {
        return null;
      }

      const containerStyle = {
        paddingTop
      };
      return (
        <FlatList
          style={styles.vList}
          ListHeaderComponent={() => (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>Scroll up to view photos</Text>
            </View>
          )}
          contentContainerStyle={containerStyle}
          data={data}
          renderItem={this._renderItem}
          keyExtractor={(item, i) => item.url + i}
          showsVerticalScrollIndicator={false}
        />
      );
    }
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
  photo: {
    backgroundColor: "#fff",
    marginRight: 2
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#e0e0e0"
  },
  image: {
    resizeMode: "contain"
  },
  vPhoto: {
    backgroundColor: "#e0e0e0",
    marginBottom: 2
  },
  vImage: {
    resizeMode: "contain"
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
  },
  banner: {
    height: 18,
    backgroundColor: "#999",
    paddingLeft: 15,
    justifyContent: "center"
  },
  bannerText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600"
  },
  vList: {
    flex: 1
  },
  info: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 2
  }
});
