import React, { Component } from "react";
import { Animated, Text, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import * as Submissions from "./store/submissions";
import { RED } from "./Colors";

const mapStateToProps = state => ({
  deleteMode: state.submissions.deleteMode,
  deleting: state.submissions.deleting,
  marked: state.submissions.markedForDeletion
});

const mapDispatchToProps = {
  set: Submissions.actions.set
};

class DeleteSubmissions extends Component {
  state = {
    opacity: new Animated.Value(0)
  };

  componentDidUpdate(previous) {
    if (previous.deleteMode !== this.props.deleteMode) {
      const toValue = this.props.deleteMode ? 1 : 0;
      Animated.timing(
        this.state.opacity,
        { toValue, duration: 150 },
        { useNativeDriver: true }
      ).start();
    }
  }

  _onPress = () => {
    if (!this.props.marked.length) {
      this.props.set({
        deleteMode: false
      });
      return;
    }
    this.props.set({
      deleting: true
    });
  };

  render() {
    const opacity = {
      opacity: this.state.opacity
    };
    const text = this.props.marked.length ? "Delete" : "Cancel";
    return (
      <Animated.View style={[styles.container, opacity]}>
        <TouchableOpacity
          style={styles.btn}
          onPress={this._onPress}
          disabled={this.props.deleting}
        >
          <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteSubmissions);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    borderRadius: 5,
    backgroundColor: RED,
    bottom: 15,
    right: 15
  },
  btn: {
    padding: 8
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12
  }
});
