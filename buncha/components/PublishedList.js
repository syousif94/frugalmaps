import React, { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
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
import { FORM_WIDTH } from "./SubmitForm";
import SubmitSegmentItem from "./SubmitSegmentItem";

export default ({ page, pages, setPage }) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.submissions.published, shallowEqual);

  useEffect(() => {
    dispatch(getPublished());
  }, []);

  return (
    <FlatList
      style={styles.list}
      data={data}
      contentContainerStyle={styles.content}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            key={item._id}
            style={styles.item}
            onPress={() => {
              console.log(item);
            }}
          >
            <Text style={{ fontWeight: "700" }}>
              {index + 1}. {item._source.title}
            </Text>
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
            renderItem={props => <SubmitSegmentItem {...props} />}
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
    width: "100%",
    paddingTop: IOS ? getInset("top") + 20 : 20,
    maxWidth: FORM_WIDTH,
    paddingHorizontal: 20,
    alignSelf: "center",
    paddingBottom: 80
  },
  item: {
    paddingVertical: 10,
    backgroundColor: "#fff"
  }
});
