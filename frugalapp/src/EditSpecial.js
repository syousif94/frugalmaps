import React, { Component } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";
import { ANDROID } from "./Constants";

export default class EditSpecial extends Component {
  scrollToTop = () => {
    this._scrollView.scrollTo({ x: 0, y: 0 });
  };

  render() {
    return (
      <KeyboardAwareScrollView
        innerRef={ref => (this._scrollView = ref)}
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={ANDROID ? 120 : 0}
      >
        <SafeAreaView style={styles.container}>
          {this.props.children}
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff"
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 5
  }
});
