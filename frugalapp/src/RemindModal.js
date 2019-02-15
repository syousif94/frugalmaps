import React, { PureComponent } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { RED, BLUE } from "./Colors";

export default class RemindModal extends PureComponent {
  render() {
    const containerStyle = [styles.container];
    const modalStyle = [styles.modal];
    return (
      <Animated.View style={containerStyle}>
        <Animated.View style={modalStyle}>
          <View style={styles.header}>
            <Text style={styles.titleText}>Remind Me</Text>
            <Text style={styles.nameText}>Happy Hour</Text>
            <Text style={styles.locationText}>Loro</Text>
          </View>
          <TouchableOpacity style={styles.radioBtn}>
            <View style={styles.radioBorder} />
            <Text style={styles.radioText}>These days</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioBtn}>
            <View style={styles.radioBorder} />
            <Text style={styles.radioText}>Every time</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioBtn}>
            <View style={styles.radioBorder}>
              <View style={styles.radioMarker} />
            </View>
            <Text style={styles.radioText}>Never</Text>
          </TouchableOpacity>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    width: 276,
    backgroundColor: "#fff",
    borderRadius: 7,
    overflow: "hidden"
  },
  header: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    paddingTop: 40
  },
  titleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
  radioBtn: {
    height: 44,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  radioBorder: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center"
  },
  radioMarker: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#13BE24"
  },
  radioText: {
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 10,
    color: "#444"
  },
  actions: {
    flexDirection: "row"
  },
  actionBtn: {
    flex: 1,
    height: 44,
    justifyContent: "center",
    alignItems: "center"
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "500",
    color: RED
  },
  saveText: {
    fontSize: 15,
    fontWeight: "500",
    color: BLUE
  }
});
