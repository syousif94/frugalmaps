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
import { connect } from "react-redux";

import { withNavigation } from "react-navigation";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { AWSCF } from "./Constants";

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

const MapIcon = ({ onPress }) => {
  return (
    <View style={styles.action}>
      <TouchableOpacity style={styles.mapBtn} onPress={onPress}>
        <FontAwesome name="map-marker" size={16} color="#fff" />
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
    paddingLeft: 7,
    paddingRight: 4,
    paddingVertical: 4
  },
  mapBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    paddingBottom: 2
  },
  chevron: {
    marginLeft: -1
  },
  actionText: {
    marginRight: -1,
    marginLeft: 5,
    fontWeight: "600",
    color: "#fff"
  }
});
