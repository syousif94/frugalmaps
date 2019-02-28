import React, { PureComponent } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { connect } from "react-redux";
import { RED, BLUE } from "./Colors";
import * as Going from "./store/going";
import { AWSCF } from "./Constants";

const mapState = state => ({
  visible: state.going.visible,
  selected: state.going.selected
});

const mapDispatch = {
  set: Going.actions.set
};

class GoingModal extends PureComponent {
  state = {
    opacity: new Animated.Value(0)
  };

  componentDidUpdate(_, prev) {
    if (prev.visible !== this.props.visible) {
      const toValue = this.props.visible ? 1 : 0;
      Animated.timing(
        this.state.opacity,
        { toValue, duration: 200 },
        { useNativeDriver: true }
      ).start();
    }
  }

  _dismiss = () => {
    this.props.set({
      selected: null
    });
  };

  _renderContent = () => {
    if (!this.props.selected) {
      return null;
    }
    const {
      selected: { _source: item, _id: id }
    } = this.props;

    const image = item.photos.sort((a, b) => {
      const aRatio = a.thumb.width / a.thumb.height;
      const bRatio = b.thumb.width / b.thumb.height;
      return bRatio - aRatio;
    })[0];

    const imageSource = {
      uri: `${AWSCF}${image.thumb.key}`,
      height: image.thumb.height,
      width: image.thumb.width
    };
    return (
      <View style={styles.header}>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.headerContent}>
          <Text style={styles.nameText}>{item.title}</Text>
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
      </View>
    );
  };

  render() {
    const pointerEvents = this.props.visible ? "auto" : "none";
    const containerStyle = [
      styles.container,
      {
        opacity: this.state.opacity
      }
    ];
    const translateY = this.state.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [40, 0]
    });
    const modalStyle = [
      styles.modal,
      {
        transform: [{ translateY }]
      }
    ];
    return (
      <Animated.View style={containerStyle} pointerEvents={pointerEvents}>
        <Animated.View style={modalStyle}>
          {this._renderContent()}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={this._dismiss}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(GoingModal);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    width: 290,
    backgroundColor: "#fff",
    borderRadius: 7,
    overflow: "hidden"
  },
  header: {
    overflow: "hidden",
    width: 290
  },
  headerContent: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    paddingTop: 40
  },
  nameText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
  locationText: {
    marginTop: 2,
    color: "#e0e0e0",
    fontSize: 14,
    fontWeight: "600"
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover"
  },
  actions: {
    backgroundColor: "#fff",
    flexDirection: "row"
  },
  actionBtn: {
    flex: 1,
    height: 44,
    justifyContent: "center",
    alignItems: "center"
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "500",
    color: RED
  },
  saveText: {
    fontSize: 15,
    fontWeight: "500",
    color: BLUE
  }
});
