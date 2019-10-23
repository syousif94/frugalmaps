import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import SubmitForm from "../components/SubmitForm";
import SubmissionList from "../components/SubmissionList";
import PublishedList from "../components/PublishedList";
import { WEB } from "../utils/Constants";

const pages = WEB ? ["Pending", "Published"] : ["Form", "Pending", "Published"];

function componentForPage(page, setPage) {
  let Component;
  switch (page) {
    case "Form":
      Component = SubmitForm;
      break;
    case "Pending":
      Component = SubmissionList;
      break;
    case "Published":
      Component = PublishedList;
      break;
    default:
      break;
  }

  if (Component) {
    return <Component pages={pages} page={page} setPage={setPage} />;
  }

  return null;
}

export default () => {
  const [page, setPage] = useState(pages[0]);
  if (WEB) {
    return (
      <View style={styles.container}>
        <SubmitForm />
        <View style={styles.lists}>{componentForPage(page, setPage)}</View>
      </View>
    );
  }
  return (
    <View style={styles.container}>{componentForPage(page, setPage)}</View>
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
