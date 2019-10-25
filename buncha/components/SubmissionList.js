import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList
} from "react-native";
import { getSubmissions } from "../store/submissions";
import { restore } from "../store/submission";
import SegmentedControl from "./SegmentedControl";
import { IOS, WEB } from "../utils/Constants";
import { getInset } from "../utils/SafeAreaInsets";
import { FORM_WIDTH } from "./SubmitForm";

export default ({ page, pages, setPage }) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.submissions.list);

  useEffect(() => {
    dispatch(getSubmissions());
  }, []);

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={data}
      renderItem={({ item, index }) => {
        const { id: fid, ...event } = item;
        event.fid = fid;
        return (
          <TouchableOpacity
            key={`${index}`}
            style={styles.item}
            onPress={() => {
              dispatch(restore(event));
              if (!WEB) {
                setPage(pages[0]);
              }
            }}
          >
            <Text>{item.id}</Text>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
          </TouchableOpacity>
        );
      }}
      ListHeaderComponent={() => {
        return (
          <SegmentedControl
            containerStyle={{ marginBottom: 5 }}
            options={pages}
            onPress={setPage}
            selected={page}
          />
        );
      }}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  content: {
    width: "100%",
    paddingTop: IOS ? getInset("top") + 20 : 20,
    maxWidth: FORM_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingBottom: 80
  },
  separator: {
    height: 1,
    backgroundColor: "#f2f2f2"
  },
  item: {
    paddingVertical: 10,
    backgroundColor: "#fff"
  }
});
