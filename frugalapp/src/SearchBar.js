import React, { PureComponent } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { connect } from "react-redux";
import { ANDROID } from "./Constants";
import * as Search from "./store/search";
import emitter from "tiny-emitter/instance";

class SearchBar extends PureComponent {
  _onChangeText = text => {
    this.props.set({
      text
    });
  };

  focus = () => {
    requestAnimationFrame(() => {
      this._input.focus();
    });
  };

  _onFocus = () => {
    emitter.emit("toggle-search", true);
  };

  _onSubmit = () => {
    emitter.emit("toggle-search", false);
  };

  render() {
    const { value } = this.props;
    return (
      <View style={styles.search}>
        <View style={styles.searchLine}>
          <Entypo name="magnifying-glass" size={18} color="#000" />
          <TextInput
            ref={ref => (this._input = ref)}
            placeholder="trivia, karaoke, brunch, wine, etc."
            style={styles.input}
            placeholderTextColor="#333"
            returnKeyType="done"
            onChangeText={this._onChangeText}
            value={value}
            // onFocus={this._onFocus}
            onBlur={this._onBlur}
            autoCapitalize="none"
            clearButtonMode="always"
            underlineColorAndroid="transparent"
            autoCorrect={false}
            selectTextOnFocus
            onSubmitEditing={this._onSubmit}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  value: state.search.text
});

const mapDispatchToProps = {
  set: Search.actions.set
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(SearchBar);

const styles = StyleSheet.create({
  search: {
    margin: 7,
    marginBottom: 3.5,
    backgroundColor: "#ededed",
    borderRadius: 8,
    paddingLeft: 12
  },
  searchLine: {
    flexDirection: "row",
    alignItems: "center"
  },
  input: {
    height: 44,
    fontSize: 16,
    paddingLeft: 10,
    flex: 1,
    marginRight: 12,
    paddingBottom: ANDROID ? 1 : 0
  }
});
