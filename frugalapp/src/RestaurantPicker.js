import React, { Component } from "react";
import _ from "lodash";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  KeyboardAvoidingView,
  Keyboard
} from "react-native";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import { Entypo } from "@expo/vector-icons";
import Header from "./PickerHeader";
import { IOS, ANDROID } from "./Constants";
import emitter from "tiny-emitter/instance";

import PublishedItem from "./PublishedItem";
import * as Published from "./store/published";
import * as Submissions from "./store/submissions";

import RestaurantsSuggesting from "./RestaurantsSuggesting";
import SearchButton from "./SearchButton";

const mapStateToProps = state => ({
  data: state.published.data,
  filter: state.submissions.filter,
  refreshing: state.published.refreshing
});

const mapDispatchToProps = {
  set: Published.actions.set,
  setSubmissions: Submissions.actions.set
};

class RestaurantPicker extends Component {
  static id = "restaurantSearch";

  componentDidMount() {
    this._onRefresh();
    emitter.on("focus-location-box", this.focusInput);
  }

  componentWillUnmount() {
    emitter.off("focus-location-box", this.focusInput);
  }

  focusInput = (id = RestaurantPicker.id) => {
    if (id !== RestaurantPicker.id) {
      return;
    }
    this._input.focus();
  };

  _onChangeText = text => {
    this.props.setSubmissions({
      filter: text
    });
  };

  _renderItem = data => <PublishedItem {...data} />;

  _keyExtractor = item => item._id;

  _renderHeader = () => <Header select={this.props.select} />;

  _onRefresh = () => {
    this.props.set({
      refreshing: true
    });
  };

  render() {
    const { value, listBottom, data, set, ...props } = this.props;
    const SafeView = IOS ? SafeAreaView : View;
    return (
      <View style={styles.container}>
        <SafeView>
          <View style={styles.title}>
            <Text style={styles.titleText}>Select a Restaurant</Text>
          </View>
          <View style={styles.search}>
            <Entypo name="magnifying-glass" size={18} color="#000" />
            <TextInput
              {...props}
              value={value}
              ref={ref => (this._input = ref)}
              style={styles.input}
              placeholder="Restaurant"
              onChangeText={this._onChangeText}
              placeholderTextColor="#333"
              returnKeyType="done"
              clearButtonMode="always"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              selectTextOnFocus
            />
          </View>
          <RestaurantsSuggesting />
        </SafeView>
        <View style={styles.divider} />
        <KeyboardSpacer>
          <FlatList
            refreshing={this.props.refreshing}
            onRefresh={this._onRefresh}
            ListHeaderComponent={this._renderHeader}
            style={styles.list}
            data={data}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            keyboardDismissMode="none"
            keyboardShouldPersistTaps="handled"
            alwaysBounceVertical
            ItemSeparatorComponent={() => <View style={styles.divider} />}
          />
        </KeyboardSpacer>
        <SearchButton id={RestaurantPicker.id} />
      </View>
    );
  }
}

class KeyboardSpacer extends Component {
  state = {
    keyboardHeight: 0
  };

  componentDidMount() {
    if (ANDROID) {
      const show = IOS ? "keyboardWillShow" : "keyboardDidShow";
      const hide = IOS ? "keyboardWillHide" : "keyboardDidHide";
      this.keyboardWillShowListener = Keyboard.addListener(
        show,
        this._keyboardWillShow
      );
      this.keyboardWillHideListener = Keyboard.addListener(
        hide,
        this._keyboardWillHide
      );
    }
  }

  componentWillUnmount() {
    if (ANDROID) {
      this.keyboardWillShowListener.remove();
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
  };

  render() {
    const { children } = this.props;

    if (ANDROID) {
      const { keyboardHeight } = this.state;
      return (
        <View style={[styles.list, { paddingBottom: keyboardHeight }]}>
          {children}
        </View>
      );
    } else {
      return (
        <KeyboardAvoidingView style={styles.list} behavior="padding">
          {children}
        </KeyboardAvoidingView>
      );
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(RestaurantPicker);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: IOS ? 5 : 10,
    paddingBottom: IOS ? 5 : 0
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
    paddingLeft: 10,
    marginRight: 10,
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
