import React, { PureComponent } from "react";
import {
  FlatList,
  Animated,
  StyleSheet,
  Keyboard,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { IOS, ANDROID } from "./Constants";

class SearchSuggestions extends PureComponent {
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

  render() {
    const containerStyle = [
      styles.container,
      {
        paddingBottom: this.state.keyboardHeight,
        opacity: this.props.opacity.interpolate({
          inputRange: [1, 2],
          outputRange: [0, 1],
          extrapolate: "clamp"
        })
      }
    ];

    const pointerEvents = this.props.searching ? "auto" : "none";

    return (
      <Animated.View style={containerStyle} pointerEvents={pointerEvents}>
        <FlatList data={this.props.results} style={styles.list} />
      </Animated.View>
    );
  }
}

const mapState = state => ({
  results: state.search.results
});

export default connect(mapState)(SearchSuggestions);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 58,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#efefef",
    elevation: 8
  },
  list: {
    flex: 1
  }
});
