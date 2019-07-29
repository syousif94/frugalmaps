import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, Text } from "react-native";
import { getEvent } from "../store/events";
import { WEB } from "../utils/Constants";
import { Helmet } from "react-helmet";
import DetailView from "../components/DetailView";

export default ({ navigation }) => {
  const dispatch = useDispatch();

  const id = navigation.getParam("id", null);

  const item = useSelector(state => (id ? state.events.data[id] : null));

  useEffect(() => {
    if (!item) {
      dispatch(getEvent(id));
    }
  }, []);

  return (
    <View style={styles.container}>
      {WEB ? (
        <Helmet>
          <title>
            {item ? `${item._source.location} - Buncha` : "Loading"}
          </title>
        </Helmet>
      ) : null}
      {item ? (
        <DetailView item={item} id={id} />
      ) : (
        <View style={styles.loading}>
          <Text style={styles.titleText}>Loading Data</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    zIndex: 10
  },
  loading: {
    padding: 20
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600"
  }
});
