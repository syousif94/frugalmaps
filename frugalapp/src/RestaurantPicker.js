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
import api from "./API";
import { Entypo } from "@expo/vector-icons";
import RestaurantSuggestion from "./RestaurantSuggestion";
import Footer from "./PickerHeader";
import { IOS, ANDROID } from "./Constants";

class RestaurantPicker extends Component {
  state = {
    data: []
  };

  constructor(props) {
    super(props);

    this._fetchSuggestions = _.throttle(async text => {
      try {
        let query = `input=${text}&types=establishment`;

        if (this.props.location) {
          const { longitude, latitude } = this.props.location;
          const locationQuery = `&location=${latitude},${longitude}&radius=10000`;
          query = `${query}${locationQuery}`;
        }

        const res = await api("places/suggest", {
          query
        });

        if (this.props.value === "") {
          return;
        }

        this.setState({
          data: res.values
        });
      } catch (error) {
        console.log(error);
      }
    }, 50);
  }

  focusInput = () => {
    this._input.focus();
  };

  _onChangeText = text => {
    this.props.onChangeText(text);
    if (text === "") {
      this.setState({
        data: []
      });
    } else {
      this._fetchSuggestions(text);
    }
  };

  _renderItem = data => (
    <RestaurantSuggestion
      {...data}
      onPress={this.props.select}
      key={data.item.place_id}
    />
  );

  _keyExtractor = (item, index) => item.place_id;

  _renderFooter = () => <Footer data={this.state.data} />;

  render() {
    const { onChangeText, listBottom, ...props } = this.props;
    const SafeView = IOS ? SafeAreaView : View;
    return (
      <View style={styles.container}>
        <SafeView>
          <View style={styles.title}>
            <Text style={styles.titleText}>Submit a Special</Text>
          </View>
          <View style={styles.search}>
            <Entypo name="magnifying-glass" size={18} color="#000" />
            <TextInput
              {...props}
              ref={ref => (this._input = ref)}
              style={styles.input}
              placeholder="Restaurant"
              onChangeText={this._onChangeText}
              placeholderTextColor="#333"
              returnKeyType="search"
              clearButtonMode="always"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              selectTextOnFocus
            />
          </View>
        </SafeView>
        <View style={styles.divider} />
        <KeyboardSpacer>
          <FlatList
            ListHeaderComponent={this._renderFooter}
            style={styles.list}
            data={this.state.data}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            keyboardDismissMode="none"
            keyboardShouldPersistTaps="handled"
            alwaysBounceVertical
            ItemSeparatorComponent={() => <View style={styles.divider} />}
          />
        </KeyboardSpacer>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  location: state.location.coordinates
});

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
  null,
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
