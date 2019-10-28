import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";
import { useSelector } from "react-redux";
import PlanHeader from "../components/PlanHeader";
import PlanFriendItem from "../components/PlanFriendItem";

const friends = [
  {
    name: "Sammy Yousif",
    id: "1"
  },
  {
    name: "Kelly Zupan",
    id: "2"
  }
];

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
      <FlatList
        style={styles.list}
        data={friends}
        renderItem={data => <PlanFriendItem {...data} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => <PlanHeader event={event} plan={plan} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
  },
  list: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: "#fafafa",
    marginLeft: 59
  }
});
