import React, { Component } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Platform,
  Keyboard,
  InteractionManager
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { connect } from "react-redux";
import moment from "moment";
import emitter from "tiny-emitter/instance";

import * as Location from "./store/location";
import { BLUE } from "./Colors";
import { Constants } from "expo";
import { ANDROID, IOS } from "./Constants";

const notched = Platform.OS === "ios" && Constants.statusBarHeight > 40;

// class Search extends Component {
//   render() {
//     const { selected, index, onPress } = this.props;

//     let iconColor = "#000";
//     const textStyle = [styles.text];
//     if (selected === index) {
//       iconColor = BLUE;
//       textStyle.push(styles.blueText);
//     }
//     return (
//       <TouchableOpacity style={styles.tab} onPress={onPress}>
//         <View style={styles.icon}>
//           <Entypo name="magnifying-glass" size={20} color={iconColor} />
//         </View>
//         <Text style={textStyle}>Search</Text>
//       </TouchableOpacity>
//     );
//   }
// }

class Calendar extends Component {
  render() {
    const { selected, index, onPress } = this.props;

    const dateStyle = [styles.dateText];
    const textStyle = [styles.text];
    if (selected === index) {
      dateStyle.push(styles.blueText);
      textStyle.push(styles.blueText);
    }

    const today = moment();
    const date = today.format("MMM D");
    const day = today.format("ddd");
    return (
      <TouchableOpacity style={styles.tab} onPress={onPress}>
        <View style={styles.icon}>
          <Text style={dateStyle}>{day}</Text>
        </View>
        <Text style={textStyle}>{date}</Text>
      </TouchableOpacity>
    );
  }
}

class Upload extends Component {
  render() {
    const { selected, index, onPress } = this.props;

    let iconColor = "#000";
    const textStyle = [styles.text];
    if (selected === index) {
      iconColor = BLUE;
      textStyle.push(styles.blueText);
    }
    return (
      <TouchableOpacity style={styles.tab} onPress={onPress}>
        <View style={styles.icon}>
          <Entypo name="circle-with-plus" size={18} color={iconColor} />
        </View>
        <Text style={textStyle}>Submit</Text>
      </TouchableOpacity>
    );
  }
}

class Map extends Component {
  render() {
    const { selected, index, onPress } = this.props;

    let iconColor = "#000";
    const textStyle = [styles.text];
    if (selected === index) {
      iconColor = BLUE;
      textStyle.push(styles.blueText);
    }
    return (
      <TouchableOpacity style={styles.tab} onPress={onPress}>
        <View style={styles.icon}>
          <Entypo name="map" size={18} color={iconColor} />
        </View>
        <Text style={textStyle}>Map</Text>
      </TouchableOpacity>
    );
  }
}

class TabBar extends Component {
  state = {
    hidden: false
  };

  componentDidMount() {
    if (IOS) {
      return;
    }
    this.keyboardWillShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardWillHide
    );
  }

  componentWillUnmount() {
    if (IOS) {
      return;
    }
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  _keyboardWillShow = () => {
    this.setState({
      hidden: true
    });
  };

  _keyboardWillHide = () => {
    this.setState({
      hidden: false
    });
  };

  _onMap = () => {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.navigate("Map");
      requestAnimationFrame(() => {
        emitter.emit("enable-markers");
      });
    });
  };

  _onCalendar = () => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate("Calendar");
      InteractionManager.runAfterInteractions(() => {
        emitter.emit("reclip-calendar");
      });
    });
  };

  _onSubmit = () => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate("Submit");
    });

    // emitter.emit("focus-picker");
  };

  _onLayout = e => {
    if (ANDROID) {
      return;
    }
    const {
      nativeEvent: {
        layout: { height }
      }
    } = e;
    this.props.set({
      listBottom: height
    });
  };

  render() {
    if (this.state.hidden) {
      return <View />;
    }
    const selected = this.props.navigation.state.index;
    return (
      <SafeAreaView style={styles.container} onLayout={this._onLayout}>
        <View style={styles.footer}>
          <Calendar selected={selected} onPress={this._onCalendar} index={0} />
          <Upload selected={selected} index={1} onPress={this._onSubmit} />
          <Map selected={selected} index={2} onPress={this._onMap} />
        </View>
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = {
  set: Location.actions.set
};

export default connect(
  null,
  mapDispatchToProps
)(TabBar);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0"
  },
  footer: {
    height: 50,
    flexDirection: "row"
  },
  tab: {
    justifyContent: notched ? "space-between" : "center",
    alignItems: "center",
    flex: 1
  },
  icon: {
    paddingBottom: notched ? 0 : 2,
    paddingTop: notched ? 7 : 0,
    flex: notched ? 1 : null,
    justifyContent: "center",
    alignItems: "center"
  },
  dateText: {
    fontSize: 15,
    fontWeight: "700"
  },
  text: {
    fontSize: 10,
    fontWeight: "500"
  },
  blueText: {
    color: BLUE
  }
});
