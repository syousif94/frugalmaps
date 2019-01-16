import React, { Component } from "react";
import { View, Animated, StyleSheet, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { IOS } from "./Constants";

const mapStateToProps = state => ({
  refreshing: state.submissions.suggesting
});

class RestaurantSuggesting extends Component {
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
        { duration: 50, toValue },
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
    }, 50);
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
          animating={IOS ? this.state.loading : true}
          color="#555"
          style={styles.indicator}
        />
      </Animated.View>
    );
  }
}

export default connect(mapStateToProps)(RestaurantSuggesting);

const size = 24;
const left = (44 - size) / 2;
const bottom = (44 - size) / 2;

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
