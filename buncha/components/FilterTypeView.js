import React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { PAGE } from "../store/filters";
import { getInset } from "../utils/SafeAreaInsets";
import { RED, BLUE } from "../utils/Colors";
import * as Events from "../store/events";
import _ from "lodash";

export default ({ page }) => {
  const tags = useSelector(state => state.events.tags, shallowEqual);
  const isPage = page === PAGE.TYPE;
  const pointerEvents = isPage ? "auto" : "none";
  return (
    <View
      pointerEvents={pointerEvents}
      style={[
        styles.container,
        {
          opacity: isPage ? 1 : 0
        }
      ]}
    >
      <FlatList
        contentContainerStyle={styles.content}
        data={tags}
        style={styles.list}
        renderItem={data => <Button {...data} />}
        keyExtractor={(item, index) => `${index}`}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListHeaderComponent={() => <HeaderView data={tags} />}
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
          minWidth: 18,
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

const HeaderView = ({ data }) => {
  const dispatch = useDispatch();

  const countText = data.length
    ? `${data.length} tag${data.length !== 1 ? "s" : ""}`
    : "Loading..";
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titleText}>{PAGE.TYPE}</Text>
          <Text style={styles.subText}>{countText}</Text>
        </View>
        <TouchableOpacity style={styles.navButton}>
          <Text style={[styles.navButtonText]}>All Events</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
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
    marginLeft: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)"
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
  },
  navButton: {
    flexDirection: "row",
    paddingHorizontal: 15,
    height: 34,
    borderRadius: 34 / 2,
    backgroundColor: BLUE,
    justifyContent: "center",
    alignItems: "center"
  },
  navButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700"
  }
});
