import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { BLUE } from "../utils/Colors";
import { useSelector, useDispatch } from "react-redux";
import { submitEvent } from "../store/submission";

export default () => {
  const dispatch = useDispatch();
  const saving = useSelector(state => state.submission.saving);
  const deleting = useSelector(state => state.submission.saving);
  const submitting = saving || deleting;
  return (
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
  );
};

const styles = StyleSheet.create({
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
