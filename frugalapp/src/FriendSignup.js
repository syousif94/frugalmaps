import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";

import FriendForm from "./FriendForm";
import FriendSMSCode from "./FriendSMSCode";

export default class FriendSignup extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Swiper loop={false} scrollEnabled={false} showsPagination={false}>
          <FriendForm />
          <FriendSMSCode />
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
