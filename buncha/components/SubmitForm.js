import React, { memo } from "react";
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
import { getHistory } from "../screens";
import SubmitTags from "./SubmitTags";
import SubmitDayPicker from "./SubmitDayPicker";
import SubmitPlacePicker from "./SubmitPlacePicker";
import { useSelector, useDispatch } from "react-redux";
import SubmissionReset from "./SubmissionReset";
import { submitEvent } from "../store/submission";
import SegmentedControl from "./SegmentedControl";
import { useDimensions } from "../utils/Hooks";
import SubmitSegmentItem from "./SubmitSegmentItem";
import TimeInput from "./TimeInput";

export const FORM_WIDTH = 520;

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

const ConnectedInput = memo(({ field, ...props }) => {
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
});

const ConnectedTimeInput = memo(({ field, ...props }) => {
  const dispatch = useDispatch();
  const value = useSelector(state => state.submission[field]);
  return (
    <TimeInput
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
});

const BackButton = () => {
  const [dimensions] = useDimensions();
  if (dimensions.width <= 550) {
    return null;
  }
  return (
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
          history.pop("UpNext");
        }}
        style={{
          paddingTop: 2,
          paddingRight: 8
        }}
      >
        <Entypo name="chevron-left" size={22} color={BLUE} />
      </Link>
    </View>
  );
};

export default ({ page, setPage, pages }) => {
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
        {pages ? (
          <SegmentedControl
            options={pages}
            selected={page}
            onPress={setPage}
            renderItem={props => <SubmitSegmentItem {...props} />}
          />
        ) : null}

        <View
          style={[
            styles.row,
            { justifyContent: WEB ? "center" : null, marginTop: 20 }
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerText]}>Add Fun Stuff</Text>
            <Text style={styles.subtext}>
              Fill out the form to add fun things to Buncha
            </Text>
          </View>

          {WEB ? <BackButton /> : null}
        </View>
        <Text style={styles.instructionText}>Title</Text>
        <ConnectedInput
          field="title"
          placeholder="Happy Hour, Trivia Night, Karaoke, etc."
          autoComplete="off"
          name="location"
        />
        <Text style={styles.instructionText}>Description</Text>
        <ConnectedInput
          multiline
          field="description"
          placeholder="Please include any information that can't be found online. Websites and location details are encouraged."
        />
        <Text style={styles.instructionText}>Tags</Text>
        <SubmitTags />
        <Text style={styles.instructionText}>Location</Text>
        <SubmitPlacePicker />
        <Text style={styles.subtext}>
          Try including the city and state if you can't find what you're looking
          for
        </Text>
        <Text style={styles.instructionText}>Days</Text>
        <SubmitDayPicker />
        <View style={styles.row}>
          <View style={styles.time}>
            <Text style={styles.instructionText}>Starts at</Text>
            <ConnectedTimeInput
              name="timeStartSearch"
              field="start"
              placeholder="Open"
            />
          </View>
          <View style={{ width: 10 }} />
          <View style={styles.time}>
            <Text style={styles.instructionText}>Ends at</Text>
            <ConnectedTimeInput
              name="timeEndSearch"
              field="end"
              placeholder="Close"
            />
          </View>
        </View>
        <Text style={styles.subtext}>
          Formats like 7, 11a, or 4:20pm are all valid
        </Text>
        <Text style={styles.subtext}>
          Leave blank for opening or closing hours
        </Text>
        <Text style={styles.instructionText}>Admin Code</Text>
        <ConnectedInput field="postCode" placeholder="Leave this blank" />
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
      <SubmissionReset />
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
    maxWidth: FORM_WIDTH,
    padding: 20,
    alignSelf: "center",
    paddingTop: IOS ? getInset("top") + 20 : 20,
    paddingBottom: 120
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
