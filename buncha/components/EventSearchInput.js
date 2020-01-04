import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Input from "./Input";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WEB } from "../utils/Constants";
import { buttonHeight } from "./PickerButton";
import { BLUE } from "../utils/Colors";
import * as Events from "../store/events";
import _ from "lodash";

const searchText = "Search";

function usePlaceholder(tags) {
  const [placeholder, setPlaceholder] = useState(searchText);

  useEffect(() => {
    if (!tags.length) {
      return setPlaceholder(searchText);
    }

    const text = _.shuffle(tags)
      .slice(0, 3)
      .map(tag => tag.text)
      .join(", ");

    setPlaceholder(`Try ${text}`);
  }, [tags]);

  return [placeholder];
}

export default React.forwardRef(
  ({ contentContainerStyle = {}, ...props }, ref) => {
    const dispatch = useDispatch();
    const query = useSelector(state => state.events.tag || state.events.text);
    const tags = useSelector(state => state.events.tags, shallowEqual);
    const [placeholder] = usePlaceholder(tags);
    const searching = useSelector(
      state => state.events.searching && !state.events.refreshing
    );

    const onChangeText = text => {
      dispatch(Events.filter({ text }));
    };

    return (
      <View style={contentContainerStyle} pointerEvents="box-none">
        <Input
          ref={ref}
          value={query}
          onChangeText={onChangeText}
          placeholder={placeholder}
          autoCorrect={false}
          autoCompleteType="off"
          spellCheck={false}
          autoCapitalize="none"
          returnKeyType="search"
          blurOnSubmit
          backgroundColor="rgba(180,180,180,0.1)"
          containerStyle={{ flex: 1, borderRadius: 6 }}
          style={styles.input}
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
          {...props}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  icon: {
    justifyContent: "center",
    width: 35,
    paddingLeft: 5,
    alignItems: "center"
  },
  input: {
    paddingLeft: 0,
    height: WEB ? buttonHeight - 2 : 40
  }
});
