import React, { Component } from "react";
import InputScrollView from "react-native-input-scroll-view";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";

export default class EditSpecial extends Component {
  scrollToTop = () => {
    this._scrollView.scrollTo({ x: 0, y: 0 });
  };

  render() {
    return (
      <InputScrollView
        ref={ref => (this._scrollView = ref)}
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView style={styles.container}>
          {this.props.children}
        </SafeAreaView>
      </InputScrollView>
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
