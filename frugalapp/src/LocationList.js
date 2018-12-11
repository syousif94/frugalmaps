import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  SectionList,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { MapView } from "expo";

import LocationSuggestion from "./LocationSuggestion";
import { IOS, ANDROID } from "./Constants";

class LocationList extends Component {
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

  _renderSectionHeader = data => {
    return (
      <View>
        <View style={styles.sectionHeader} key={data.index}>
          <Text style={styles.sectionText}>{data.section.title}</Text>
        </View>
      </View>
    );
  };

  _renderFooter = () => {
    return (
      <MapView pointerEvents="none" style={{ height: 100 }} showsUserLocation />
    );
  };

  _renderSectionItem = data => (
    <LocationSuggestion
      id={this.props.id}
      {...data}
      key={data.section.title + data.index}
    />
  );

  _renderList = () => {
    const { completions, suggestions, text } = this.props;

    let data = suggestions;

    if (text && text.length && completions.length) {
      data = [{ title: "Autocomplete", data: completions }, ...suggestions];
    }

    return (
      <SectionList
        style={styles.list}
        renderItem={this._renderSectionItem}
        renderSectionHeader={this._renderSectionHeader}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        sections={data}
        keyExtractor={(item, index) => item + index}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical
      />
    );
  };

  render() {
    const { focused, listTop, listBottom } = this.props;

    const hide = !focused || !listTop || (IOS && !listBottom);

    const opacity = hide ? 0 : 1;

    const { keyboardHeight } = this.state;

    const paddingBottom = keyboardHeight - listBottom;

    const pointerEvents = hide ? "none" : "auto";

    return (
      <View
        {...{ pointerEvents }}
        style={[styles.container, { top: listTop, paddingBottom, opacity }]}
      >
        {this._renderFooter()}
        {this._renderList()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  completions: state.location.completions,
  suggestions: state.location.suggestions,
  focused: state.location.focused,
  listTop: state.location.listTop,
  listBottom: state.location.listBottom,
  text: state.location.text
});

export default connect(mapStateToProps)(LocationList);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0"
  },
  list: {
    flex: 1
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0"
  },
  sectionHeader: {
    height: 16,
    backgroundColor: "#B5B5B5",
    justifyContent: "center",
    paddingLeft: 10
  },
  sectionText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600"
  }
});
