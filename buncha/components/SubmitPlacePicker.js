import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking
} from "react-native";
import Input from "./Input";
import store from "../store";
import locate from "../utils/Locate";
import api from "../utils/API";
import { getPlace } from "../store/submission";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";
import SubmitMapView from "./SubmitMapView";
import { WEB } from "../utils/Constants";
import Link from "./Link";
import { BLUE } from "../utils/Colors";

export default () => {
  const [query, results, getQuery, searching] = useGetPlaces();
  const dispatch = useDispatch();
  const place = useSelector(state => state.submission.place);
  const fetchingPlace = useSelector(state => state.submission.fetchingPlace);

  if (place) {
    return (
      <View style={{ marginTop: 5 }}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            dispatch({
              type: "submission/set",
              payload: {
                place: null
              }
            });
          }}
        >
          <View style={{ flex: 1, alignSelf: "center" }}>
            <Text style={styles.instructionText}>{place.name}</Text>
            <Text style={[styles.subtext, { marginTop: 2 }]}>
              {place.formatted_address}
            </Text>
          </View>
          <View style={styles.clear}>
            <Ionicons
              name="ios-close-circle"
              size={18}
              color="rgba(0,0,0,0.4)"
            />
          </View>
        </TouchableOpacity>
        <Link
          to={place.website}
          onPress={() => {
            if (WEB) {
              window.open(place.website, "_blank");
            } else {
              Linking.openURL(place.website);
            }
          }}
        >
          <Text
            style={{
              marginTop: 5,
              color: BLUE,
              textDecorationLine: "underline",
              textDecorationColor: BLUE
            }}
          >
            {place.website}
          </Text>
        </Link>

        <SubmitMapView style={styles.map} place={place} />
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
    <View>
      <Input
        value={query}
        onChangeText={getQuery}
        placeholder="Type to search"
        autoCorrect={false}
        autoCompleteType="off"
        spellCheck={false}
        autoCapitalize="words"
        style={{ paddingLeft: 0 }}
        render={() => (
          <View style={styles.icon}>
            {searching ? (
              <ActivityIndicator
                style={{ transform: [{ scale: 0.7 }] }}
                size="small"
                color="#ccc"
              />
            ) : (
              <Ionicons name="ios-search" size={18} color={BLUE} />
            )}
          </View>
        )}
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
  row: {
    flexDirection: "row"
  },
  loading: {
    marginVertical: 20
  },
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
  icon: {
    justifyContent: "center",
    width: 35,
    paddingLeft: 5,
    alignItems: "center"
  },
  map: {
    marginTop: 10,
    height: 200,
    borderRadius: 5,
    overflow: "hidden"
  },
  clear: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center"
  }
});

function useGetPlaces() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState();

  let request = null;

  const fetchResults = _.throttle(async text => {
    const now = Date.now();
    if (text.length) {
      request = now;
      setSearching(true);
    }

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

    if (request === now) {
      setSearching(false);
    }
  }, 100);

  const getQuery = text => {
    setQuery(text);

    fetchResults(text);
  };

  return [query, results, getQuery, searching];
}
