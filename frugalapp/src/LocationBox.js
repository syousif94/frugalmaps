import React, { Component } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import * as Location from "./store/location";

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

  _onChangeText = text => {
    this.props.set({
      searchText: text
    });
  };

  render() {
    const { value } = this.props;
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
            onChangeText={this._onChangeText}
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

const mapStateToProps = state => ({
  value: state.location.searchText
});

const mapDispatchToProps = {
  set: Location.actions.set
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationBox);

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
