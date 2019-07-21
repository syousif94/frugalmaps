import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity
} from "react-native";
import { getInset } from "../utils/SafeAreaInsets";
import { IOS } from "../utils/Constants";
import { BLUE } from "../utils/Colors";

export default () => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        contentInsetAdjustmentBehavior="never"
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.headerText}>Account</Text>

        <TextInput
          keyboardType="numeric"
          style={styles.input}
          placeholder="Number"
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  list: {
    flex: 1
  },
  listContent: {
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
    padding: 10,
    paddingTop: IOS ? getInset("top") : 15
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000"
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    marginTop: 20
  },
  button: {
    marginTop: 20,
    height: 50,
    borderRadius: 8,
    backgroundColor: BLUE,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 200,
    alignSelf: "center",
    width: "100%"
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff"
  }
});
