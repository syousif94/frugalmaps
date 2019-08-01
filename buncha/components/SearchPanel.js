import React, { useCallback, useState } from "react";
import { View, Animated, StyleSheet } from "react-native";
import SearchCityList from "./SearchCityList";

export const PAGES = ["When", "Where", "What"];

export default ({ translateY, toggle }) => {
  const [height, setHeight] = useState(0);

  const onLayout = useCallback(e => {
    const height = e.nativeEvent.layout.height;
    setHeight(height);
  }, []);

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
