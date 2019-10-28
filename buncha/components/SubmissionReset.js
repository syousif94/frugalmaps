import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { RED } from "../utils/Colors";
import { reset } from "../store/submission";
import { getInset } from "../utils/SafeAreaInsets";
import { Ionicons } from "@expo/vector-icons";

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
      <View>
        {submission ? (
          <React.Fragment>
            <Text style={styles.descriptionText}>Currently Editing</Text>
            <Text style={styles.titleText}>{submission.title}</Text>
            <Text style={styles.descriptionText} numberOfLines={2}>
              {submission.description}
            </Text>
          </React.Fragment>
        ) : (
          <Text style={styles.fidText}>{fid}</Text>
        )}
      </View>
      <Ionicons
        name="md-close"
        size={14}
        color="#fff"
        style={{ alignSelf: "center", marginRight: 5, marginLeft: 20 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: getInset("top"),
    right: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: RED,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    flexDirection: "row"
  },
  titleText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700"
  },
  descriptionText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500"
  },
  fidText: {
    fontSize: 10,
    color: "rgba(0,0,0,0.6)",
    fontWeight: "500"
  }
});
