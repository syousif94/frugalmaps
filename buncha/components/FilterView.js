import React, {
  useState,
  useEffect,
  useRef,
  memo,
  useLayoutEffect
} from "react";
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Easing
} from "react-native";
import BlurView from "./BlurView";
import { WEB } from "../utils/Constants";
import emitter from "tiny-emitter/instance";

import FilterPlaceView from "./FilterPlaceView";
import FilterTimeView from "./FilterTimeView";
import { useKeyboardHeight, useDimensions } from "../utils/Hooks";
import { getInset } from "../utils/SafeAreaInsets";

export default memo(() => {
  const [page, setPage] = useState(null);
  const [panelHeight, setPanelHeight] = useState(0);
  const [keyboard, bottomOffset] = useKeyboardHeight();
  const [dimensions] = useDimensions();
  const animation = useRef(new Animated.Value(0));

  const wideScreen = dimensions.width > 500;

  const wideOrWeb = wideScreen || WEB;

  useEffect(() => {
    const handlePage = page => {
      if (page) {
        setPage(page);
        Animated.timing(
          animation.current,
          {
            toValue: wideOrWeb ? 1 : 0,
            duration: 200,
            easing: Easing.in(Easing.quad)
          },
          { useNativeDriver: true }
        ).start();
      } else {
        Animated.timing(
          animation.current,
          {
            toValue: wideOrWeb ? 0 : panelHeight,
            duration: 200,
            easing: Easing.out(Easing.quad)
          },
          { useNativeDriver: true }
        ).start(() => {
          setPage(null);
        });
      }
    };

    emitter.on("filters", handlePage);

    return () => emitter.off("filters", handlePage);
  }, [panelHeight, wideOrWeb]);

  useLayoutEffect(() => {
    if (!page) {
      animation.current.setValue(panelHeight);
    }
  }, [panelHeight, page]);

  const panelTranslate = Animated.add(animation.current, keyboard.current);

  const dismissStyle = wideOrWeb
    ? {
        ...StyleSheet.absoluteFillObject,
        opacity: animation.current
      }
    : {
        opacity: animation.current.interpolate({
          inputRange: [0, panelHeight],
          outputRange: [1, 0]
        }),
        ...StyleSheet.absoluteFillObject
      };

  const panelStyle = wideOrWeb
    ? {
        opacity: animation.current,
        alignSelf: "center",
        overflow: "hidden",
        borderRadius: 8,
        width: "100%",
        maxWidth: 360,
        transform: [
          {
            translateY: animation.current.interpolate({
              inputRange: [0, 1],
              outputRange: [60, 0]
            })
          }
        ]
      }
    : {
        opacity: page ? 1 : 0,
        transform: [
          {
            translateY: panelTranslate
          }
        ],
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflow: "hidden",
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0
      };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: wideOrWeb ? dimensions.height * 0.1 : null }
      ]}
      pointerEvents={page ? "auto" : "none"}
    >
      <Animated.View style={dismissStyle}>
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
      <Animated.View style={panelStyle}>
        <BlurView>
          <View
            style={{
              paddingTop: 10,
              paddingBottom: wideOrWeb ? 20 : getInset("bottom") + 10
            }}
            onLayout={e => {
              if (!wideOrWeb) {
                setPanelHeight(e.nativeEvent.layout.height);
              }
            }}
          >
            <FilterPlaceView />
            <FilterTimeView
              bottomOffset={bottomOffset}
              panelHeight={panelHeight}
            />
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: WEB ? 48 : 0,
    paddingHorizontal: WEB ? 12 : null
  },
  dismiss: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)"
  }
});
