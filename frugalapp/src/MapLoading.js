import React, { Component } from "react";
import { View, Animated, StyleSheet, ActivityIndicator } from "react-native";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  refreshing: state.events.refreshing
});

class MapLoading extends Component {
  state = {
    opacity: new Animated.Value(0),
    loading: false
  };

  componentDidUpdate(previous) {
    if (this.props.refreshing && !previous.refreshing) {
      if (this.state.loading) {
        return;
      }
      this.setState({
        loading: true
      });
      const toValue = 1;
      Animated.timing(
        this.state.opacity,
        { duration: 150, toValue },
        { useNativeDriver: true }
      ).start(this._onLoading);
    }
  }

  _onLoading = () => {
    setTimeout(() => {
      if (!this.props.refreshing) {
        Animated.timing(
          this.state.opacity,
          { duration: 150, toValue: 0 },
          { useNativeDriver: true }
        ).start(() => {
          this.setState({
            loading: false
          });
        });
      } else {
        this._onLoading();
      }
    }, 1000);
  };

  render() {
    const containerStyle = [
      styles.container,
      {
        opacity: this.state.opacity
      }
    ];
    return (
      <Animated.View style={containerStyle} pointerEvents="none">
        <View style={styles.bg} />
        <ActivityIndicator
          animating={this.state.loading}
          color="#555"
          style={styles.indicator}
        />
      </Animated.View>
    );
  }
}

export default connect(mapStateToProps)(MapLoading);

const size = 24;
const left = 10 + (44 - size) / 2;
const bottom = left + 28;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom,
    left,
    height: size,
    width: size,
    justifyContent: "center",
    alignItems: "center"
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ededed"
  },
  indicator: {
    transform: [{ scale: 0.8 }]
  }
});
