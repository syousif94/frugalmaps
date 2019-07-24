import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity
} from "react-native";
import { Helmet } from "react-helmet";
import SubmissionInput from "./SubmissionInput";
import { Entypo } from "@expo/vector-icons";
import { IOS, WEB } from "../utils/Constants";
import { getInset } from "../utils/SafeAreaInsets";
import Link from "./Link";
import { BLUE } from "../utils/Colors";
import { navigate, getHistory } from "../screens";
import SubmitTags from "./SubmitTags";

export default () => {
  return (
    <View style={styles.container}>
      <Helmet>
        <title>Submit - Buncha</title>
      </Helmet>
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="never"
      >
        <View style={[styles.row, { justifyContent: WEB ? "center" : null }]}>
          <Text style={styles.headerText}>Submit Event</Text>
          {WEB ? (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                justifyContent: "center"
              }}
            >
              <Link
                to="/"
                onPress={() => {
                  const history = getHistory();
                  if (history) {
                    if (history.length > 2) {
                      history.goBack();
                    } else {
                      navigate("UpNext");
                    }
                  }
                }}
                style={{
                  paddingTop: 2,
                  paddingRight: 8
                }}
              >
                <Entypo name="chevron-left" size={22} color={BLUE} />
              </Link>
            </View>
          ) : null}
        </View>

        <Text style={styles.instructionText}>1. Location</Text>
        <SubmissionInput
          placeholder="Type to search"
          containerStyle={styles.inputContainer}
          style={styles.input}
        />
        <Text style={styles.subtext}>
          Try including the city and state if you can't find what you're looking
          for
        </Text>
        <Text style={styles.instructionText}>2. Title</Text>
        <SubmissionInput
          placeholder="What's the event?"
          containerStyle={styles.inputContainer}
          style={styles.input}
        />
        <View style={styles.row}>
          <View style={styles.time}>
            <Text style={styles.instructionText}>3. Starts at</Text>
            <SubmissionInput
              placeholder="Open"
              containerStyle={styles.inputContainer}
              style={styles.input}
            />
          </View>
          <View style={{ width: 10 }} />
          <View style={styles.time}>
            <Text style={styles.instructionText}>4. Ends at</Text>
            <SubmissionInput
              placeholder="Close"
              containerStyle={styles.inputContainer}
              style={styles.input}
            />
          </View>
        </View>
        <Text style={styles.instructionText}>5. Description</Text>
        <SubmissionInput
          placeholder="Optional"
          containerStyle={styles.inputContainer}
          style={styles.input}
        />
        <Text style={styles.instructionText}>6. Tags</Text>
        <SubmitTags />
        <Text style={styles.instructionText}>7. Admin Code</Text>
        <SubmissionInput
          placeholder="Leave this blank"
          containerStyle={styles.inputContainer}
          style={styles.input}
        />
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Submit</Text>
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
  headerText: {
    fontSize: 28,
    fontWeight: "700"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
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
    alignSelf: "center",
    marginTop: IOS ? getInset("top") : 10
  },
  instructionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
    marginTop: 25
  },
  subtext: {
    marginTop: 4,
    fontSize: 12,
    color: "#aaa"
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    borderRadius: 5
  },
  input: {
    height: 44,
    paddingLeft: 10,
    flex: 1
  },
  submitButton: {
    height: 40,
    borderRadius: 20,
    backgroundColor: BLUE,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
    width: 180
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700"
  }
});
