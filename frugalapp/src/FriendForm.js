import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";
import { BLUE } from "./Colors";

export default class FriendForm extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
        >
          <View style={styles.form}>
            <View style={styles.photo}>
              <TouchableOpacity style={styles.photoBtn}>
                <Text style={styles.photoText}>Photo</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputs}>
              <TouchableWithoutFeedback>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="#999"
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback>
                <TextInput
                  style={styles.input}
                  placeholder="Number"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </TouchableWithoutFeedback>
              <View style={styles.contacts}>
                <TouchableOpacity style={styles.btn}>
                  <Text style={styles.btnText}>Load Contacts</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text style={styles.instructionText}>
            Fill out the form to see what your friends are going to.
          </Text>
          <Text style={styles.instructionText}>
            You can block anyone in your contacts list from seeing your
            activity.
          </Text>
        </ScrollView>
        <Text style={styles.instructionText}>
          All fields and contact access required.
        </Text>
        <View style={styles.done}>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  content: {
    padding: 5
  },
  form: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  photo: {
    margin: 5,
    backgroundColor: "#ededed",
    width: 152,
    height: 152,
    borderRadius: 8
  },
  photoBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  photoText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 22
  },
  inputs: {
    flex: 1
  },
  input: {
    height: 44,
    margin: 5,
    backgroundColor: "#ededed",
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 10
  },
  contacts: {
    height: 44,
    margin: 5,
    backgroundColor: BLUE,
    borderRadius: 8
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600"
  },
  done: {
    height: 44,
    margin: 10,
    backgroundColor: "#2FE56E",
    borderRadius: 8
  },
  instructionText: {
    marginTop: 15,
    marginHorizontal: 25,
    color: "#555",
    textAlign: "center",
    lineHeight: 22
  }
});
