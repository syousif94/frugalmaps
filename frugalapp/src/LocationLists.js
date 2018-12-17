import React, { Component } from "react";
import { View, StyleSheet, Keyboard, TextInput } from "react-native";
import { connect } from "react-redux";
import { ScrollableTabView } from "@valdio/react-native-scrollable-tabview";

import LocationListBar from "./LocationListBar";
import { IOS, ANDROID } from "./Constants";
import LocationListHeader from "./LocationListHeader";
import LocationList from "./LocationList";

class LocationLists extends Component {
  state = {
    keyboardHeight: 0
  };

  componentDidMount() {
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

  _renderTabBar = () => <LocationListBar />;

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
        <LocationListHeader id={id} />
        <ScrollableTabView
          renderTabBar={this._renderTabBar}
          contentProps={contentProps}
          showsHorizontalScrollIndicator={false}
          prerenderingSiblingsNumber={1}
          initialPage={1}
        >
          <LocationList tabLabel="Autocomplete" id={this.props.id} />
          <LocationList tabLabel="Popular" id={this.props.id} />
          <LocationList tabLabel="Closest" id={this.props.id} />
        </ScrollableTabView>
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
  }
});
