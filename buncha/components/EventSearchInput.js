import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Input from "./Input";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WEB } from "../utils/Constants";
import { buttonHeight } from "./PickerButton";
import { BLUE } from "../utils/Colors";
import _ from "lodash";
import { SearchContext } from "../utils/Search";
import * as Events from "../store/events";

function Icon({ searching }) {
  return (
    <View style={styles.icon} pointerEvents="none">
      {searching ? (
        <ActivityIndicator
          style={{ transform: [{ scale: 0.7 }] }}
          size="small"
          color="#ccc"
        />
      ) : (
        <Ionicons
          name="ios-search"
          size={WEB ? 18 : 20}
          color={BLUE}
          style={{ marginTop: 1 }}
        />
      )}
    </View>
  );
}

export default React.forwardRef(
  ({ contentContainerStyle = {}, ...props }, ref) => {
    const dispatch = useDispatch();

    const [filter, setFilter] = useContext(SearchContext);

    const tag = useSelector(state => state.events.tag);

    const value = tag && tag.length ? tag : filter;

    const searching = useSelector(
      state => state.events.searching && !state.events.refreshing
    );

    const onChangeText = text => {
      setFilter(text);
      dispatch(Events.filter({ tag: null }));
    };

    return (
      <View style={contentContainerStyle} pointerEvents="box-none">
        <Input
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder="Search"
          autoCorrect={false}
          autoCompleteType="off"
          spellCheck={false}
          autoCapitalize="none"
          returnKeyType="search"
          blurOnSubmit
          render={() => <Icon searching={searching} />}
          backgroundColor="rgba(180,180,180,0.1)"
          containerStyle={{ flex: 1, borderRadius: 5 }}
          style={styles.input}
          {...props}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  icon: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10
  },
  input: {
    paddingLeft: 0,
    height: buttonHeight - 2,
    fontSize: WEB ? 14 : 15
  }
});
