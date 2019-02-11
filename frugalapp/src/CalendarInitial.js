import React, { PureComponent } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { ANDROID } from "./Constants";

class CalendarInitial extends PureComponent {
  render() {
    const { initialized, listTop } = this.props;

    if (initialized || !listTop) {
      return null;
    }

    const style = [
      styles.initialLoad,
      {
        top: listTop
      }
    ];

    if (ANDROID) {
      return (
        <View style={style}>
          <Text style={styles.initialText}>
            Initial location may take several seconds
          </Text>
        </View>
      );
    }

    return (
      <View style={style}>
        <ActivityIndicator style={styles.loading} size="large" color="#444" />
        <Text style={styles.initialText}>
          Initial location may take several seconds
        </Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  initialized: state.events.initialized,
  listTop: state.location.listTop
});

export default connect(mapStateToProps)(CalendarInitial);

const styles = StyleSheet.create({
  initialLoad: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center"
  },
  initialText: {
    width: 220,
    marginTop: ANDROID ? 100 : 25,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 16,
    color: "#444"
  },
  loading: {
    marginTop: 15,
    transform: [{ scale: 0.8 }]
  }
});
