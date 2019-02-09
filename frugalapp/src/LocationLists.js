import React, { Component } from "react";
import { View, StyleSheet, Keyboard, TextInput } from "react-native";
import { connect } from "react-redux";
import { ScrollableTabView } from "@valdio/react-native-scrollable-tabview";
import emitter from "tiny-emitter/instance";

import LocationListBar from "./LocationListBar";
import { IOS, ANDROID, INITIAL_REGION } from "./Constants";
import LocationListFooter from "./LocationListFooter";
import LocationList from "./LocationList";
import { MapView } from "expo";

class LocationLists extends Component {
  state = {
    keyboardHeight: 0
  };

  componentDidMount() {
    emitter.on("preview-bounds", this._previewBounds);
    emitter.on("reset-bounds-preview", this._resetRegion);

    const show = IOS ? "keyboardWillShow" : "keyboardDidShow";
    this.keyboardWillShowListener = Keyboard.addListener(
      show,
      this._keyboardWillShow
    );

    if (ANDROID) {
      const hide = IOS ? "keyboardWillHide" : "keyboardDidHide";
      this.keyboardWillHideListener = Keyboard.addListener(
        hide,
        this._keyboardWillHide
      );
    }
  }

  componentWillUnmount() {
    emitter.off("preview-bounds", this._previewBounds);
    emitter.off("reset-bounds-preview", this._resetRegion);
    this.keyboardWillShowListener.remove();
    if (ANDROID) {
      this.keyboardWillHideListener.remove();
    }
  }

  _keyboardWillShow = e => {
    this.setState({
      keyboardHeight: e.endCoordinates.height
    });
  };

  _keyboardWillHide = () => {
    this.setState({
      keyboardHeight: 0
    });
    if (this.props.focused) {
      TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField());
    }
  };

  _renderTabBar = () => {
    const { focused, listTop, listBottom } = this.props;
    const hide = !focused || !listTop || (IOS && !listBottom);
    return <LocationListBar hide={hide} />;
  };

  _previewBounds = bounds => {
    const coords = [
      {
        latitude: bounds.northeast.lat,
        longitude: bounds.northeast.lng
      },
      {
        latitude: bounds.southwest.lat,
        longitude: bounds.southwest.lng
      }
    ];

    this._map.fitToCoordinates(coords);
  };

  _resetRegion = () => {
    this._map.animateToRegion(INITIAL_REGION, 0);
  };

  _setMap = ref => (this._map = ref);

  render() {
    const { focused, listTop, listBottom, id } = this.props;

    const hide = !focused || !listTop || (IOS && !listBottom);

    const opacity = hide ? 0 : 1;

    const { keyboardHeight } = this.state;

    const paddingBottom = keyboardHeight - listBottom;

    const pointerEvents = hide ? "none" : "auto";

    const contentProps = {
      keyboardDismissMode: "none",
      keyboardShouldPersistTaps: "always"
    };

    return (
      <View
        {...{ pointerEvents }}
        style={[styles.container, { top: listTop, paddingBottom, opacity }]}
      >
        <MapView
          pointerEvents="none"
          style={styles.map}
          showsUserLocation
          ref={this._setMap}
          initialRegion={INITIAL_REGION}
          zoomEnabled={false}
          rotateEnabled={false}
          scrollEnabled={false}
          pitchEnabled={false}
          showsCompass={false}
          toolbarEnabled={false}
          showsMyLocationButton={false}
        />
        <View style={styles.lists}>
          <ScrollableTabView
            renderTabBar={this._renderTabBar}
            contentProps={contentProps}
            showsHorizontalScrollIndicator={false}
            prerenderingSiblingsNumber={1}
            // initialPage={1}
            alwaysBounceVertical={true}
          >
            <LocationList tabLabel="Popular" id={this.props.id} />
            <LocationList tabLabel="Closest" id={this.props.id} />
            <LocationList tabLabel="Autocomplete" id={this.props.id} />
          </ScrollableTabView>
          <LocationListFooter id={id} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  focused: state.location.focused,
  listTop: state.location.listTop,
  listBottom: state.location.listBottom
});

export default connect(mapStateToProps)(LocationLists);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 6
  },
  map: {
    height: 80
  },
  lists: {
    flex: 1
  }
});
