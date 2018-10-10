import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  SectionList
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";

import * as Location from "./store/location";
import LocationSuggestion from "./LocationSuggestion";

class LocationList extends Component {
  _renderItem = data => (
    <LocationSuggestion {...data} key={data.item.place_id} />
  );

  _renderSectionItem = data => (
    <LocationSuggestion {...data} key={data.section.title + data.index} />
  );

  _keyExtractor = (item, index) => item.place_id;

  _renderList = () => {
    const { completions, suggestions, text } = this.props;

    if (text && text.length) {
      return (
        <FlatList
          style={styles.list}
          data={completions}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
          alwaysBounceVertical
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      );
    } else {
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
          sections={suggestions}
          keyExtractor={(item, index) => item + index}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
          alwaysBounceVertical
        />
      );
    }
  };

  render() {
    const { focused, listTop } = this.props;

    if (!focused || !listTop) {
      return null;
    }

    return (
      <View style={[styles.container, { top: listTop }]}>
        <SafeAreaView style={styles.flex}>
          <KeyboardAvoidingView behavior="padding" style={styles.flex}>
            {this._renderList()}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  completions: state.location.completions,
  suggestions: state.location.suggestions,
  focused: state.location.focused,
  listTop: state.location.listTop,
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
  flex: {
    flex: 1
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
