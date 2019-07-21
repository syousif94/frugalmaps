import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Helmet } from "react-helmet";
import SubmissionInput from "./SubmissionInput";
import { EVENT_TYPES } from "../utils/Constants";

const inputStyle = {
  height: 44,
  paddingLeft: 10,
  flex: 1
};

export default () => {
  return (
    <View style={styles.container}>
      <Helmet>
        <title>Submit - Buncha</title>
      </Helmet>
      <ScrollView style={styles.list} contentContainerStyle={styles.content}>
        <Text style={styles.headerText}>Submit Event</Text>
        <Text style={styles.instructionText}>1. Location</Text>
        <SubmissionInput
          placeholder="Type to search"
          containerStyle={styles.inputContainer}
          style={inputStyle}
        />
        <Text style={styles.instructionText}>2. Title</Text>
        <SubmissionInput
          placeholder="What's the event?"
          containerStyle={styles.inputContainer}
          style={inputStyle}
        />
        <View style={styles.row}>
          <View style={styles.time}>
            <Text style={styles.instructionText}>3. Starts at</Text>
            <SubmissionInput
              placeholder="Open"
              containerStyle={styles.inputContainer}
              style={inputStyle}
            />
          </View>
          <View style={{ width: 10 }} />
          <View style={styles.time}>
            <Text style={styles.instructionText}>4. Ends at</Text>
            <SubmissionInput
              placeholder="Close"
              containerStyle={styles.inputContainer}
              style={inputStyle}
            />
          </View>
        </View>
        <Text style={styles.instructionText}>5. Description</Text>
        <SubmissionInput
          placeholder="Optional"
          containerStyle={styles.inputContainer}
          style={inputStyle}
        />
        <Text style={styles.instructionText}>6. Tags</Text>
        <View style={styles.tags}>
          {EVENT_TYPES.map((tag, index) => {
            return (
              <TouchableOpacity key={`${index}`} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  headerText: {
    marginTop: "10%",
    marginBottom: "2%",
    fontSize: 28,
    fontWeight: "700"
  },
  row: {
    flexDirection: "row"
  },
  time: {
    flex: 1
  },
  list: {
    flex: 1
  },
  content: {
    width: "100%",
    maxWidth: 500,
    padding: 10,
    alignSelf: "center"
  },
  instructionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
    marginTop: 25
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderRadius: 5
  },
  tags: {
    paddingVertical: 2.5,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  tag: {
    height: 28,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    paddingHorizontal: 6,
    alignItems: "center",
    flexDirection: "row",
    marginRight: 5,
    marginVertical: 2.5
  },
  tagText: {
    fontSize: 14,
    color: "#000"
  }
});
