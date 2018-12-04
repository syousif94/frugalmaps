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
        <View style={{ flex: 1 }} />
        <View style={styles.btnBg}>
          <TouchableOpacity onPress={this._onPress}>
            <SafeArea>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Got It</Text>
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
