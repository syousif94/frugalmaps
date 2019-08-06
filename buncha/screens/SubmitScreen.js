import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import SubmitForm from "../components/SubmitForm";
import SubmissionList from "../components/SubmissionList";
import PublishedList from "../components/PublishedList";
import { WEB } from '../utils/Constants'

export default () => {
  const [page, setPage] = useState(0);
  return (
    <View style={styles.container}>
      <SubmitForm />
      {WEB ? (
        <View style={styles.lists}>
        {page === 0 ? <SubmissionList /> : <PublishedList />}
      </View>
      ) : null}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  lists: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    borderRightWidth: 1,
    borderColor: "#f2f2f2",
    backgroundColor: "#fff"
  }
});
