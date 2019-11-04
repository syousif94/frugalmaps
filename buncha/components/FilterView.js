import React, { useState, useEffect, useRef, memo } from "react";
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Easing
} from "react-native";
import BlurView from "./BlurView";
import { HEIGHT, WEB } from "../utils/Constants";
import emitter from "tiny-emitter/instance";

import FilterTypeView from "./FilterTypeView";
import FilterPlaceView from "./FilterPlaceView";
import FilterTimeView from "./FilterTimeView";
import { useKeyboardHeight } from "../utils/Hooks";

export const PANEL_HEIGHT = HEIGHT * 0.65;

export default memo(() => {
  const [keyboard, bottomOffset] = useKeyboardHeight();
  const [page, setPage] = useState(null);
  const animation = useRef(new Animated.Value(0));
  useEffect(() => {
    const handlePage = page => {
      if (page) {
        setPage(page);
        Animated.timing(
          animation.current,
          { toValue: 1, duration: 200, easing: Easing.in(Easing.quad) },
          { useNativeDriver: true }
        ).start();
      } else {
        Animated.timing(
          animation.current,
          { toValue: 0, duration: 200, easing: Easing.out(Easing.quad) },
          { useNativeDriver: true }
        ).start(() => {
          setPage(null);
        });
      }
    };

    emitter.on("filters", handlePage);

    return () => emitter.off("filters", handlePage);
  }, []);

  const panelTranslate = Animated.add(
    animation.current.interpolate({
      inputRange: [0, 1],
      outputRange: [PANEL_HEIGHT, 0]
    }),
    keyboard.current
  );

  return (
    <View style={styles.container} pointerEvents={page ? "auto" : "none"}>
      <Animated.View
        style={{
          opacity: animation.current,
          ...StyleSheet.absoluteFillObject
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.dismiss}
          onPress={() => {
            requestAnimationFrame(() => {
              emitter.emit("filters");
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
                translateY: panelTranslate
              }
            ]
          }
        ]}
      >
        <BlurView style={styles.blur}>
          <FilterTypeView page={page} />
          <FilterPlaceView page={page} />
          <FilterTimeView page={page} bottomOffset={bottomOffset} />
        </BlurView>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: WEB ? 48 : 0
  },
  dismiss: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  panel: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    width: "100%",
    maxWidth: 600,
    height: PANEL_HEIGHT,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden"
  },
  blur: {
    flex: 1
  }
});
