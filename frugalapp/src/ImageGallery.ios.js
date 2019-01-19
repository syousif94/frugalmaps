import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";

import { withNavigation } from "react-navigation";
import { Entypo } from "@expo/vector-icons";
import { WIDTH, AWSCF } from "./Constants";
import EventList from "./InfoEventList";

import * as Events from "./store/events";

class ImageGallery extends Component {
  shouldComponentUpdate(next) {
    return (
      next.doc._id !== this.props.doc._id ||
      next.paddingTop !== this.props.paddingTop
    );
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

  _renderItem = ({ item }) => {
    const { height, disabled, doc, horizontal = true } = this.props;

    if (!item.thumb) {
      return null;
    }

    let uri = `${AWSCF}${item.thumb.key}`;
    let imageHeight = item.thumb.height;
    let width = item.thumb.width;

    const source = {
      uri
    };

    if (horizontal) {
      const imageWidth = (height / imageHeight) * width;

      return (
        <TouchableWithoutFeedback disabled={disabled} onPress={this._onPress}>
          <View key={uri} style={[styles.photo, { height }]}>
            <ActivityIndicator
              style={styles.loader}
              size="small"
              color="#000"
            />
            <Image
              key={uri}
              source={source}
              style={{
                width: imageWidth,
                height
              }}
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
          <Image key={uri} source={source} style={{ width: WIDTH, height }} />
        </View>
      );
    }
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
      horizontal = true,
      paddingTop
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
                keyExtractor={this._keyExtractor}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
          <Icon onPress={this._onPress} disabled={disabled} narrow={narrow} />
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
          keyExtractor={this._keyExtractor}
          showsVerticalScrollIndicator={false}
        />
      );
    }
  }
}

const Icon = ({ disabled, narrow, onPress = null }) => {
  if (disabled) {
    return null;
  }
  return (
    <View style={styles.action}>
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
  photo: {
    backgroundColor: "#fff",
    marginRight: 2
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#e0e0e0"
  },
  vPhoto: {
    backgroundColor: "#e0e0e0",
    marginBottom: 1
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
  chevron: {
    marginLeft: -1
  },
  actionText: {
    marginRight: -1,
    marginLeft: 5,
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
    marginBottom: 1
  }
});
