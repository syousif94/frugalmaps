import React, { Component } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { SafeArea, HEIGHT, WIDTH } from "./Constants";
import { withNavigation } from "react-navigation";

class IntroScreen extends Component {
  _onPress = () => {
    this.props.navigation.navigate({
      routeName: "Home"
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bg}>
          <Image
            resizeMode="cover"
            style={styles.bgImage}
            source={require("../assets/intro.png")}
          />
        </View>
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Buncha is a calendar of fun and affordable stuff to do nearby
          </Text>
        </View>
        <View style={styles.prompts}>
          <Text style={styles.subText}>
            Be sure to allow location access and notifications for the best
            experience
          </Text>
        </View>

        <View style={styles.btnBg}>
          <TouchableOpacity onPress={this._onPress}>
            <SafeArea>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Get Started</Text>
              </View>
            </SafeArea>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default withNavigation(IntroScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#353535"
  },
  instructions: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center"
  },
  instructionText: {
    marginTop: 95,
    lineHeight: 28,
    fontSize: 18,
    color: "#fff",
    textAlign: "center"
  },
  prompts: {
    paddingHorizontal: 30,
    paddingBottom: 15
  },
  subText: {
    lineHeight: 24,
    fontSize: 14,
    color: "#ddd",
    textAlign: "center"
  },
  bg: {
    ...StyleSheet.absoluteFillObject
  },
  bgImage: {
    height: HEIGHT,
    width: WIDTH
    // height: 896,
    // width: 414
  },
  btnBg: {
    backgroundColor: "#2FE56E"
  },
  btn: {
    height: 44,
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  }
});
