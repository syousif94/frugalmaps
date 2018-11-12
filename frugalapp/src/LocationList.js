import React, { Component } from "react";
import { View, Text, StyleSheet, Keyboard, SectionList } from "react-native";
import { connect } from "react-redux";

import LocationPrompt from "./LocationPrompt";
import LocationSuggestion from "./LocationSuggestion";
import { IOS } from "./Constants";

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
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
  }

  _keyboardWillShow = e => {
    this.setState({
      keyboardHeight: e.endCoordinates.height
    });
  };

  _renderSectionItem = data => (
    <LocationSuggestion {...data} key={data.section.title + data.index} />
  );

  _renderList = () => {
    const { completions, suggestions, text } = this.props;

    let data = suggestions;

    if (text && text.length && completions.length) {
      data = [{ title: "Suggestions", data: completions }, ...suggestions];
    }

    return (
      <SectionList
        style={styles.list}
        renderItem={this._renderSectionItem}
        renderSectionHeader={data => (
          <View style={styles.sectionHeader} key={data.index}>
            <Text style={styles.sectionText}>{data.section.title}</Text>
          </View>
        )}
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

    if (!focused || !listTop || (IOS && !listBottom)) {
      return null;
    }

    const { keyboardHeight } = this.state;

    const paddingBottom = keyboardHeight - listBottom;

    return (
      <View style={[styles.container, { top: listTop, paddingBottom }]}>
        {this._renderList()}
        <LocationPrompt />
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
    height: 24,
    backgroundColor: "#B5B5B5",
    justifyContent: "center",
    paddingLeft: 10
  },
  sectionText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600"
  }
});
