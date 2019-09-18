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
import { useSelector, useDispatch } from "react-redux";
import SubmissionReset from "./SubmissionReset";
import { submitEvent } from "../store/submission";

let ScrollComponent = ScrollView;
if (!WEB) {
  ScrollComponent = require("react-native-keyboard-aware-scroll-view")
    .KeyboardAwareScrollView;
}

const MOBILE_PROPS = WEB
  ? {}
  : {
      extraHeight: 50,
      extraScrollHeight: 0,
      enableResetScrollToCoords: false,
      showsVerticalScrollIndicator: false,
      viewIsInsideTabBar: true
    };

const ConnectedInput = ({ field, ...props }) => {
  const dispatch = useDispatch();
  const value = useSelector(state => state.submission[field]);
  return (
    <Input
      value={value}
      onChangeText={text => {
        dispatch({
          type: "submission/set",
          payload: {
            [field]: text
          }
        });
      }}
      {...props}
    />
  );
};

export default () => {
  const dispatch = useDispatch();
  const saving = useSelector(state => state.submission.saving);
  const deleting = useSelector(state => state.submission.saving);
  const submitting = saving || deleting;
  return (
    <View style={styles.container}>
      <Helmet>
        <title>Add Fun Stuff - Buncha</title>
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
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerText]}>Add Fun Stuff</Text>
            <Text style={styles.subtext}>
              Fill out the form to add fun things to Buncha
            </Text>
          </View>

          {WEB ? (
            <View
              style={{
                position: "absolute",
                top: 0,
                right: "100%",
                bottom: 0,
                paddingTop: 3
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
        <ConnectedInput field="title" placeholder="What's the event called?" />
        <Text style={styles.instructionText}>3. Days</Text>
        <SubmitDayPicker />
        <View style={styles.row}>
          <View style={styles.time}>
            <Text style={styles.instructionText}>4. Starts at</Text>
            <ConnectedInput field="start" placeholder="Open" />
          </View>
          <View style={{ width: 10 }} />
          <View style={styles.time}>
            <Text style={styles.instructionText}>5. Ends at</Text>
            <ConnectedInput field="end" placeholder="Close" />
          </View>
        </View>
        <Text style={styles.subtext}>
          Formats like 7, 11a, or 4:19pm are all valid
        </Text>
        <Text style={styles.subtext}>Afternoon is assumed by default</Text>
        <Text style={styles.subtext}>
          Leave blank for opening or closing hours
        </Text>
        <Text style={styles.instructionText}>6. Description</Text>
        <ConnectedInput field="description" placeholder="Optional" />
        <Text style={styles.instructionText}>7. Tags</Text>
        <SubmitTags />
        <Text style={styles.instructionText}>8. Admin Code</Text>
        <ConnectedInput field="postCode" placeholder="Leave this blank" />
        <SubmissionReset />
        <TouchableOpacity
          disabled={submitting}
          style={[
            styles.submitButton,
            { backgroundColor: submitting ? "#ccc" : BLUE }
          ]}
          onPress={() => {
            dispatch(submitEvent());
          }}
        >
          <Text style={styles.submitText}>Post</Text>
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
    maxWidth: 520,
    padding: 20,
    alignSelf: "center",
    paddingTop: IOS ? getInset("top") + 20 : 30,
    paddingBottom: 80
  },
  instructionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    marginTop: 40
  },
  subtext: {
    marginTop: 6,
    fontSize: 16,
    color: "#333"
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
