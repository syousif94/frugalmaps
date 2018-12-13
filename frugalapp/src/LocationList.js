import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  SectionList,
  TextInput,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { MapView } from "expo";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import emitter from "tiny-emitter/instance";

import LocationSuggestion from "./LocationSuggestion";
import { IOS, ANDROID } from "./Constants";
import { BLUE } from "./Colors";
import * as Location from "./store/location";
import * as Events from "./store/events";

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

  _onClosest = () => {
    emitter.emit("calendar-top");
    this.props.setEvents({
      refreshing: true
    });
    emitter.emit("blur-location-box", this.props.id);
  };

  _onNewest = () => {
    emitter.emit("calendar-top");
    this.props.setEvents({
      refreshing: true,
      recent: true
    });
    emitter.emit("blur-location-box", this.props.id);
  };

  _renderListHeader = () => {
    const closeStyle = { left: 12 };
    const newStyle = { left: 10, paddingTop: 2 };
    return (
      <View style={styles.header}>
        <View style={styles.headerBtnBg}>
          <TouchableOpacity onPress={this._onNewest} style={styles.headerBtn}>
            <View style={[styles.headerBtnIcon, newStyle]} pointerEvents="none">
              <Entypo name="new" size={17} color="#fff" />
            </View>
            <Text style={styles.headerBtnText}>Newest</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerBtnBg}>
          <TouchableOpacity onPress={this._onClosest} style={styles.headerBtn}>
            <View
              style={[styles.headerBtnIcon, closeStyle]}
              pointerEvents="none"
            >
              <FontAwesome name="location-arrow" size={14} color="#fff" />
            </View>
            <Text style={styles.headerBtnText}>Closest</Text>
          </TouchableOpacity>
        </View>
      </View>
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
        ListHeaderComponent={this._renderListHeader}
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
        <MapView pointerEvents="none" style={styles.map} showsUserLocation />
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

const mapDispatchToProps = {
  setEvents: Events.actions.set,
  setLocation: Location.actions.set
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationList);

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
    height: 100
  },
  header: {
    height: 38,
    flexDirection: "row",
    padding: 2
  },
  headerBtnBg: {
    margin: 2,
    borderRadius: 4,
    flex: 1,
    backgroundColor: BLUE
  },
  headerBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  headerBtnIcon: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  headerBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14
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
