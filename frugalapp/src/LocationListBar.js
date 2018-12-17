import React, { PureComponent } from "react";
import { Animated, View, StyleSheet, TouchableOpacity } from "react-native";
import emitter from "tiny-emitter/instance";

export default class LocationListBar extends PureComponent {
  componentDidMount() {
    emitter.on("show-completions", this._scrollToCompletions);
  }

  componentWillUnmount() {
    emitter.off("show-completions", this._scrollToCompletions);
  }

  _scrollToCompletions = () => {
    if (this.props.activeTab !== 0) {
      this.props.goToPage(0);
    }
  };

  render() {
    const active = "#fff";
    const dim = "rgba(255,255,255,0.4)";
    return (
      <View style={styles.container}>
        {this.props.tabs.map((name, page) => {
          const onPress = this.props.goToPage.bind(null, page);
          let outputRange = [dim, dim, dim];
          switch (page) {
            case 0:
              outputRange = [active, dim, dim];
              break;
            case 1:
              outputRange = [dim, active, dim];
              break;
            case 2:
              outputRange = [dim, dim, active];
              break;
            default:
              break;
          }
          const color = this.props.scrollValue.interpolate({
            inputRange: [0, 1, 2],
            outputRange
          });
          return (
            <View style={styles.tab} key={page}>
              <TouchableOpacity style={styles.btn} onPress={onPress}>
                <Animated.Text style={[styles.tabText, { color }]}>
                  {name}
                </Animated.Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 22,
    backgroundColor: "#B5B5B5",
    flexDirection: "row"
  },
  tab: {
    flex: 1
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  tabText: {
    fontSize: 12,
    color: "#ccc",
    fontWeight: "600"
  }
});
