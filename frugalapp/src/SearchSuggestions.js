import React, { PureComponent } from "react";
import { FlatList, View, StyleSheet, Keyboard, TextInput } from "react-native";
import { connect } from "react-redux";
import { IOS, ANDROID } from "./Constants";
import EventSuggestion from "./EventSuggestion";

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
    // if (this.props.focused) {
    //   TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField());
    // }
  };

  _renderItem = data => <EventSuggestion {...data} />;

  _keyExtractor = item => item._id;

  render() {
    const containerStyle = [
      styles.container,
      {
        paddingBottom: this.state.keyboardHeight
      }
    ];

    return (
      <View style={containerStyle}>
        <FlatList
          data={this.props.results}
          style={styles.list}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
          alwaysBounceVertical={true}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      </View>
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
    elevation: 8,
    borderTopWidth: 1,
    borderColor: "#e0e0e0"
  },
  list: {
    flex: 1
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0"
  }
});
