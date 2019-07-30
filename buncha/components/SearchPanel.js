import React, { useCallback, useState } from "react";
import { View, Animated, StyleSheet } from "react-native";
import SearchTime from "./SearchTime";
import SearchCityList from "./SearchCityList";
import SearchSwitcher from "./SearchSwitcher";
import SearchTags from "./SearchTags";

export const PAGES = ["When", "Where", "What"];

export default ({ translateY, toggle }) => {
  const [height, setHeight] = useState(0);

  const onLayout = useCallback(e => {
    const height = e.nativeEvent.layout.height;
    setHeight(height);
  }, []);

  const [page, setPage] = useState(PAGES[0]);

  let Component;

  switch (page) {
    case PAGES[0]:
      Component = SearchTime;
      break;
    case PAGES[1]:
      Component = SearchCityList;
      break;
    default:
      Component = null;
  }

  return (
    <View style={styles.container} pointerEvents="box-none" onLayout={onLayout}>
      {height > 0 ? (
        <Animated.View
          style={[
            styles.slider,
            {
              transform: [
                {
                  translateY: translateY.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-height, 0]
                  })
                }
              ]
            }
          ]}
        >
          <SearchTime />
          <SearchTags />
          <SearchCityList toggle={toggle} />
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden"
  },
  slider: {
    backgroundColor: "#fff",
    flex: 1
  }
});
