import React, { Component } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-navigation";
import { Consumer as ResultsConsumer } from "./LocationResults";
import { Consumer as UIConsumer } from "./LocationUI";

export default props => (
  <ResultsConsumer>
    {({ value, onChangeText }) => (
      <UIConsumer>
        {({ set }) => (
          <LocationBox value={value} onChangeText={onChangeText} set={set} />
        )}
      </UIConsumer>
    )}
  </ResultsConsumer>
);

class LocationBox extends Component {
  _onLayout = e => {
    const {
      nativeEvent: {
        layout: { y, height }
      }
    } = e;

    const listTop = y + height + 10;

    this.props.set({
      listTop
    });
  };

  _onFocus = () => {
    this.props.set({
      focused: true
    });
  };

  _onBlur = () => {
    this.props.set({
      focused: false
    });
  };

  render() {
    const { onChangeText, value } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Lit Cal</Text>
        </View>
        <View style={styles.search} onLayout={this._onLayout}>
          <Entypo name="magnifying-glass" size={18} color="#000" />
          <TextInput
            placeholder="Locating..."
            style={styles.input}
            placeholderTextColor="#333"
            returnKeyType="search"
            onChangeText={onChangeText}
            value={value}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            autoCapitalize="words"
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5
  },
  titleText: {
    fontWeight: "600",
    fontSize: 18,
    color: "#000"
  },
  search: {
    margin: 10,
    backgroundColor: "#ededed",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12
  },
  input: {
    height: 44,
    fontSize: 16,
    paddingHorizontal: 10,
    flex: 1
  }
});
