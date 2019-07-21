import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useState
} from "react";
import { View, Animated, FlatList, StyleSheet } from "react-native";
import CityOrderPicker from "../components/CityOrderPicker";
import * as Cities from "../store/cities";
import CityItem from "../components/CityItem";
import { useSelector, useDispatch } from "react-redux";

export default ({ translateY, toggle }) => {
  const cities = useSelector(state => state.cities[state.cities.list]);

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
          <CityOrderPicker />
          <View style={styles.divider} />
          <FlatList
            data={cities}
            style={styles.list}
            renderItem={data => <CityItem {...data} toggle={toggle} />}
            keyExtractor={(item, index) => `${index}`}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
          />
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
  },
  list: {
    flex: 1
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0"
  }
});
