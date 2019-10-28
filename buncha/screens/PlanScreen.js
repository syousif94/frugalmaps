import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

export default ({ navigation }) => {
  const eid = navigation.getParam("eid", null);
  const id = navigation.getParam("id", null);

  const plan = useSelector(state => (id ? state.plans.data[id] : null));
  const event = useSelector(state => (eid ? state.events.data[eid] : null));

  if ((id && !plan) || !event) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading Plans</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>testing</Text>
      {/* <PlanHeader />
    <PlanDate />
    <PlanTime /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  loading: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
