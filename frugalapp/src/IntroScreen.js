import React, { Component } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { SafeArea, HEIGHT, WIDTH } from "./Constants";
import { withNavigation } from "react-navigation";
import { grantLocation, grantNotifications } from "./Permissions";
import { Entypo } from "@expo/vector-icons";

class IntroScreen extends Component {
  _onPress = async () => {
    try {
      await grantLocation();
      await grantNotifications();
    } catch (error) {}
    requestAnimationFrame(() => {
      this.props.navigation.navigate({
        routeName: "Home"
      });
    });
  };

  render() {
    const topInstructionMargin = { marginTop: 200 };
    const bottomInstructionMargin = { marginTop: 12 };
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
          <Text style={[styles.instructionText, topInstructionMargin]}>
            Buncha is a calendar of fun and affordable stuff to do nearby
          </Text>
          <Text style={[styles.instructionText, bottomInstructionMargin]}>
            Tap on the <Entypo name="bell" size={18} color="#000" />
            's to manage reminders and send invites
          </Text>
          {/* <Text style={[styles.instructionText, bottomInstructionMargin]}>
            Hold down on <Entypo name="bell" size={18} color="#000" />
            's to send invites
          </Text> */}
          <Text style={[styles.instructionText, bottomInstructionMargin]}>
            Tap on <Entypo name="circle-with-plus" size={18} color="#000" /> to
            submit fun stuff
          </Text>
        </View>
        <View style={styles.prompts}>
          <Text style={styles.subText}>
            Please allow location access and notifications if prompted for the
            best experience
          </Text>
        </View>

        <SafeArea>
          <View style={styles.btnBg}>
            <TouchableOpacity onPress={this._onPress}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Start</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeArea>
      </View>
    );
  }
}

export default withNavigation(IntroScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  instructions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  instructionText: {
    lineHeight: 28,
    fontSize: 18,
    width: 280,
    color: "#000",
    textAlign: "center"
  },
  prompts: {
    paddingHorizontal: 30,
    paddingBottom: 15
  },
  subText: {
    lineHeight: 24,
    fontSize: 14,
    color: "#636363",
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
    backgroundColor: "#2FE56E",
    marginBottom: 10,
    marginHorizontal: 25,
    borderRadius: 8
  },
  btn: {
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  }
});
