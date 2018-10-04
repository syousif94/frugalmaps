import React, { Component } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Text
} from "react-native";
import { SafeAreaView } from "react-navigation";

import { Consumer as ResultsConsumer } from "./LocationResults";
import { Consumer as UIConsumer } from "./LocationUI";
import LocationSuggestion from "./LocationSuggestion";

export default props => (
  <ResultsConsumer>
    {({ refreshing, data, suggested }) => (
      <UIConsumer>
        {({ focused, listTop }) => (
          <LocationList
            refreshing={refreshing}
            data={data}
            suggested={suggested}
            focused={focused}
            listTop={listTop}
          />
        )}
      </UIConsumer>
    )}
  </ResultsConsumer>
);

class LocationList extends Component {
  _renderItem = data => (
    <LocationSuggestion {...data} onPress={() => {}} key={data.item.place_id} />
  );

  _keyExtractor = (item, index) => item.place_id;

  render() {
    const { refreshing, data, suggested, focused, listTop } = this.props;

    if (!focused || !listTop) {
      return null;
    }

    return (
      <View style={[styles.container, { top: listTop }]}>
        <SafeAreaView style={styles.flex}>
          <KeyboardAvoidingView behavior="padding" style={styles.flex}>
            <FlatList
              style={styles.list}
              data={data}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              keyboardDismissMode="none"
              keyboardShouldPersistTaps="handled"
              alwaysBounceVertical
              ItemSeparatorComponent={() => <View style={styles.divider} />}
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }
}

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
  }
});
