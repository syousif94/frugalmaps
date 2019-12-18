import React, { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
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
import SubmitSegmentItem from "./SubmitSegmentItem";

export default ({ page, pages, setPage }) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.submissions.list, shallowEqual);

  useEffect(() => {
    dispatch(getSubmissions());
  }, []);

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={data}
      keyExtractor={(item, index) => `${item.title}${index}`}
      renderItem={({ item, index }) => {
        const { id: fid, ...event } = item;
        event.fid = fid;
        return (
          <TouchableOpacity
            key={`${index}`}
            style={styles.item}
            onPress={() => {
              dispatch(restore(event));
              if (pages.length > 2) {
                setPage(pages[0]);
              }
            }}
          >
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.descriptionText} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={styles.idText}>{item.id}</Text>
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
            renderItem={props => (
              <SubmitSegmentItem key={props.option} {...props} />
            )}
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
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000"
  },
  descriptionText: {
    fontSize: 12,
    color: "#000"
  },
  idText: {
    fontSize: 12,
    color: "#777"
  }
});
