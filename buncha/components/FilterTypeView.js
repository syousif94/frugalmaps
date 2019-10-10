import React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { PAGE } from "../store/filters";
import { getInset } from "../utils/SafeAreaInsets";
import { RED } from "../utils/Colors";
import * as Events from "../store/events";
import _ from "lodash";

export default () => {
  const tags = useSelector(state => state.events.tags);
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.content}
        data={tags}
        style={styles.list}
        renderItem={data => <Button {...data} />}
        keyExtractor={(item, index) => `${index}`}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.titleText}>{PAGE.TYPE}</Text>
          </View>
        )}
      />
    </View>
  );
};

const Button = ({ item: { text, count }, index }) => {
  const dispatch = useDispatch();
  const onPress = () => {
    dispatch(Events.filter({ tag: text }));
  };
  return (
    <TouchableOpacity
      style={{
        alignItems: "center",
        flexDirection: "row",
        padding: 10
      }}
      onPress={onPress}
    >
      <View
        style={{
          paddingHorizontal: 3,
          paddingVertical: 1,
          borderRadius: 4,
          backgroundColor: RED,
          marginRight: 6,
          minWidth: 16,
          alignItems: "center"
        }}
      >
        <Text style={{ fontSize: 14, color: "#fff", fontWeight: "700" }}>
          {count}
        </Text>
      </View>
      <Text style={{ fontSize: 14, color: "#000", fontWeight: "600" }}>
        {index + 1}. {_.startCase(text)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1
  },
  divider: {
    height: 1,
    marginLeft: 10,
    backgroundColor: "rgba(0,0,0,0.05)"
  },
  content: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    paddingBottom: getInset("bottom") + 15
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    alignItems: "center"
  },
  titleText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "700"
  },
  subText: {
    marginTop: 1,
    fontSize: 14,
    color: "#777",
    fontWeight: "500"
  }
});
