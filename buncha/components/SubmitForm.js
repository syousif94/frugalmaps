import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity
} from "react-native";
import { Helmet } from "react-helmet";
import Input from "./Input";
import { Entypo } from "@expo/vector-icons";
import { IOS, WEB } from "../utils/Constants";
import { getInset } from "../utils/SafeAreaInsets";
import Link from "./Link";
import { BLUE } from "../utils/Colors";
import { navigate, getHistory } from "../screens";
import SubmitTags from "./SubmitTags";
import SubmitDayPicker from "./SubmitDayPicker";
import SubmitPlacePicker from "./SubmitPlacePicker";

let ScrollComponent = ScrollView;
if (!WEB) {
  ScrollComponent = require("react-native-keyboard-aware-scroll-view")
    .KeyboardAwareScrollView;
}

const MOBILE_PROPS = WEB
  ? {}
  : {
      extraHeight: 0,
      extraScrollHeight: 0,
      viewIsInsideTabBar: false
    };

export default () => {
  return (
    <View style={styles.container}>
      <Helmet>
        <title>Submit - Buncha</title>
      </Helmet>
      <ScrollComponent
        style={styles.list}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="never"
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        {...MOBILE_PROPS}
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
        <SubmitPlacePicker />
        <Text style={styles.subtext}>
          Try including the city and state if you can't find what you're looking
          for
        </Text>
        <Text style={styles.instructionText}>2. Title</Text>
        <Input placeholder="What's the event?" />
        <Text style={styles.instructionText}>3. Days</Text>
        <SubmitDayPicker />
        <View style={styles.row}>
          <View style={styles.time}>
            <Text style={styles.instructionText}>4. Starts at</Text>
            <Input placeholder="Open" />
          </View>
          <View style={{ width: 10 }} />
          <View style={styles.time}>
            <Text style={styles.instructionText}>5. Ends at</Text>
            <Input placeholder="Close" />
          </View>
        </View>
        <Text style={styles.subtext}>Format like 6am or 6:30pm</Text>
        <Text style={styles.instructionText}>6. Description</Text>
        <Input placeholder="Optional" />
        <Text style={styles.instructionText}>7. Tags</Text>
        <SubmitTags />
        <Text style={styles.instructionText}>8. Admin Code</Text>
        <Input placeholder="Leave this blank" />
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollComponent>
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
    paddingTop: IOS ? getInset("top") : 10,
    paddingBottom: 80
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
  submitButton: {
    height: 40,
    borderRadius: 20,
    backgroundColor: BLUE,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    width: 180
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700"
  }
});
