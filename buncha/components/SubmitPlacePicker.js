import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import SubmissionInput from "./SubmissionInput";
import store from "../store";
import locate from "../utils/Locate";
import api from "../utils/API";
import { getPlace } from "../store/submission";

export default () => {
  const [query, results, getQuery] = useGetPlaces();
  const dispatch = useDispatch();
  const place = useSelector(state => state.submission.place);
  const fetchingPlace = useSelector(state => state.submission.fetchingPlace);

  if (place) {
    console.log(place);
    return (
      <View style={styles.container}>
        <Text>place</Text>
      </View>
    );
  }

  if (fetchingPlace) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SubmissionInput
        value={query}
        onChangeText={getQuery}
        placeholder="Type to search"
        containerStyle={styles.inputContainer}
        style={styles.input}
      />
      {results.map((result, index) => {
        const {
          structured_formatting: { main_text: location, secondary_text: city },
          place_id
        } = result;
        const onPress = () => {
          dispatch(getPlace(place_id));
        };
        return (
          <TouchableOpacity
            style={styles.suggestion}
            key={result.place_id}
            onPress={onPress}
          >
            <Text style={styles.instructionText}>
              {index + 1}. {location}
            </Text>
            <Text style={styles.subtext}>{city}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  suggestion: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0"
  },
  instructionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000"
  },
  subtext: {
    fontSize: 12,
    color: "#aaa"
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    borderRadius: 5
  },
  input: {
    height: 44,
    paddingLeft: 10,
    flex: 1
  }
});

function useGetPlaces() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const getQuery = async text => {
    setQuery(text);

    let query = `input=${text}&types=establishment`;

    const {
      permissions: { location }
    } = store.getState();

    if (location) {
      const {
        coords: { latitude, longitude }
      } = await locate();
      const locationQuery = `&location=${latitude},${longitude}&radius=10000`;
      query = `${query}${locationQuery}`;
    }

    const res = await api("places/suggest", {
      query
    });

    setResults(res.values);
  };

  return [query, results, getQuery];
}
