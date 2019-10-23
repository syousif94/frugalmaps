import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList
} from "react-native";
import { getPublished } from "../store/submissions";
import { restore } from "../store/submission";
import { IOS } from "../utils/Constants";
import { getInset } from "../utils/SafeAreaInsets";
import SegmentedControl from "./SegmentedControl";

export default ({ page, pages, setPage }) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.submissions.published);

  useEffect(() => {
    dispatch(getPublished());
  }, []);

  return (
    <FlatList
      style={styles.list}
      data={data}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            key={item._id}
            style={styles.item}
            onPress={() => {
              console.log(item);
            }}
          >
            <Text style={{ fontWeight: "700" }}>{item._source.title}</Text>
            <Text style={{ fontWeight: "500" }}>{item._source.location}</Text>
            <Text style={{ color: "#777" }}>{item._source.city}</Text>
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
  separator: {
    height: 1,
    backgroundColor: "#f2f2f2"
  },
  content: {
    padding: 20,
    paddingTop: IOS ? getInset("top") + 20 : 20
  },
  item: {
    paddingVertical: 10,
    backgroundColor: "#fff"
  }
});
