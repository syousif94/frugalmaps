import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { RED } from "../utils/Colors";
import { reset } from "../store/submission";

export default () => {
  const dispatch = useDispatch();
  const fid = useSelector(state => state.submission.fid);
  const submission = useSelector(state =>
    state.submissions.list.find(data => data.id === fid)
  );

  if (!fid) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        dispatch(reset());
      }}
    >
      <Text>{fid}</Text>
      {submission ? (
        <React.Fragment>
          <Text>{submission.title}</Text>
          <Text>{submission.description}</Text>
        </React.Fragment>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: RED,
    marginVertical: 40
  }
});
