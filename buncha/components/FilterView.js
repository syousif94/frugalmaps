import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Easing
} from "react-native";
import BlurView from "./BlurView";
import { HEIGHT } from "../utils/Constants";
import { useAnimateOn } from "../utils/Hooks";
import { PAGE } from "../store/filters";
import FilterTypeView from "./FilterTypeView";
import FilterPlaceView from "./FilterPlaceView";
import FilterTimeView from "./FilterTimeView";

const panelHeight = HEIGHT * 0.65;

export default () => {
  const dispatch = useDispatch();

  const selectedPage = useSelector(state => state.filters.page);

  const [page, transform] = useAnimateOn(
    selectedPage,
    200,
    selectedPage ? Easing.in(Easing.quad) : Easing.out(Easing.quad)
  );

  let PageView = null;
  switch (page) {
    case PAGE.TYPE:
      PageView = FilterTypeView;
      break;
    case PAGE.WHERE:
      PageView = FilterPlaceView;
      break;
    case PAGE.WHEN:
      PageView = FilterTimeView;
      break;
  }

  return (
    <View
      style={styles.container}
      pointerEvents={selectedPage ? "auto" : "none"}
    >
      <Animated.View
        style={{ opacity: transform.current, ...StyleSheet.absoluteFillObject }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.dismiss}
          onPress={() => {
            requestAnimationFrame(() => {
              dispatch({
                type: "filters/set",
                payload: {
                  page: null
                }
              });
            });
          }}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.panel,
          {
            transform: [
              {
                translateY: transform.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [panelHeight, 0]
                })
              }
            ]
          }
        ]}
      >
        <BlurView style={styles.blur}>{PageView && <PageView />}</BlurView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  dismiss: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  panel: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: panelHeight,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden"
  },
  blur: {
    flex: 1
  }
});
