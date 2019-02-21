import React, { Component } from "react";
import { View, Animated, StyleSheet, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { SafeArea, ANDROID } from "./Constants";

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

  _renderIndicator = () => {
    if (ANDROID && !this.state.loading) {
      return null;
    }

    return (
      <ActivityIndicator
        animating={this.state.loading}
        color="#fff"
        style={styles.indicator}
      />
    );
  };

  render() {
    const fadeStyle = [
      styles.fade,
      {
        opacity: this.state.opacity
      }
    ];
    return (
      <SafeArea style={styles.container} pointerEvents="none">
        <Animated.View style={fadeStyle}>
          <View style={styles.bg} />
          {this._renderIndicator()}
        </Animated.View>
      </SafeArea>
    );
  }
}

export default connect(mapStateToProps)(MapLoading);

const size = 24;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 6
  },
  fade: {
    marginTop: 6,
    height: size,
    width: size,
    justifyContent: "center",
    alignItems: "center"
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 6
  },
  indicator: {
    transform: [{ scale: 0.8 }]
  }
});
