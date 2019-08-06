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

export default () => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.submissions.list);

  useEffect(() => {
    dispatch(getSubmissions());
  }, []);

  return (
    <FlatList
      style={styles.list}
      data={data}
      renderItem={({ item, index }) => {
        const { id: fid, ...event } = item;
        event.fid = fid;
        return (
          <TouchableOpacity
            key={`${index}`}
            style={styles.item}
            onPress={() => {
              console.log(event);
              dispatch(restore(event));
            }}
          >
            <Text>{item.id}</Text>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
          </TouchableOpacity>
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
  item: {
    padding: 10,
    backgroundColor: "#fff"
  }
});
