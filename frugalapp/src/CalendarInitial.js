import React, { PureComponent } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { HEIGHT } from "./Constants";

class CalendarInitial extends PureComponent {
  render() {
    const { initialized } = this.props;

    if (initialized) {
      return null;
    }

    return (
      <View style={styles.initialLoad}>
        <ActivityIndicator style={styles.loading} size="large" color="#444" />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  initialized: state.events.initialized
});

export default connect(mapStateToProps)(CalendarInitial);

const styles = StyleSheet.create({
  initialLoad: {
    position: "absolute",
    top: HEIGHT * 0.31,
    backgroundColor: "#fff",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center"
  },
  loading: {
    marginTop: 65,
    transform: [{ scale: 0.8 }]
  }
});
