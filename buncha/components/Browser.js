import React, { useRef, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  Animated,
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { WebView } from "react-native-webview";
import { useAnimateOn } from "../utils/Hooks";
import { HEIGHT, WIDTH } from "../utils/Constants";
import { getInset } from "../utils/SafeAreaInsets";
import { BLUE } from "../utils/Colors";
import { Entypo } from "@expo/vector-icons";
import * as Browser from "../store/browser";

const height = HEIGHT - getInset("top");

export default () => {
  const progress = useRef(new Animated.Value(0));
  const [title, setTitle] = useState(null);
  const url = useSelector(state => state.browser.url, shallowEqual);
  const [uri, transform] = useAnimateOn(url, 250);

  const containerStyle = {
    backgroundColor: "#fff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    transform: [
      {
        translateY: transform.current.interpolate({
          inputRange: [0, 1],
          outputRange: [height + 4, 0]
        })
      }
    ]
  };

  const pointerEvents = uri ? "auto" : "none";

  const progressStyle = {
    transform: [
      {
        translateX: progress.current.interpolate({
          inputRange: [0, 1],
          outputRange: [-WIDTH, 0]
        })
      }
    ]
  };

  return (
    <View style={styles.container} pointerEvents={pointerEvents}>
      <Animated.View style={containerStyle}>
        <View style={styles.topBar}>
          <Text numberOfLines={1} style={styles.titleText}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.uriText}>
            {uri}
          </Text>

          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
        {uri ? (
          <WebView
            source={{ uri }}
            style={styles.webView}
            allowsBackForwardNavigationGestures
            allowsInlineMediaPlayback
            onLoadStart={() => {
              progress.current.setValue(0.1);
            }}
            onLoadProgress={({ nativeEvent }) => {
              setTitle(nativeEvent.title);
              progress.current.setValue(nativeEvent.progress);
            }}
            onLoadEnd={({ nativeEvent }) => {
              setTitle(nativeEvent.title);
              progress.current.setValue(0);
            }}
          />
        ) : null}
        <BottomBar />
      </Animated.View>
    </View>
  );
};

const BottomBar = () => {
  const dispatch = useDispatch();
  const mode = useSelector(state => state.browser.mode, shallowEqual);
  switch (mode) {
    case Browser.MODES[0]:
      return (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottombarButton}
            onPress={() => {
              dispatch({
                type: "browser/set",
                payload: {
                  url: null
                }
              });
            }}
          >
            <Entypo name="chevron-left" color={BLUE} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottombarButton}
            onPress={() => {
              dispatch({
                type: "browser/set",
                payload: {
                  url: null
                }
              });
            }}
          >
            <Entypo name="chevron-down" color={BLUE} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottombarButton}
            onPress={() => {
              dispatch({
                type: "browser/set",
                payload: {
                  url: null
                }
              });
            }}
          >
            <Entypo name="chevron-right" color={BLUE} size={24} />
          </TouchableOpacity>
        </View>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    justifyContent: "flex-end"
  },
  webView: {
    flex: 1
  },
  topBar: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 35,
    backgroundColor: "#f4f4f4",
    justifyContent: "flex-end",
    borderBottomWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)"
  },
  titleText: {
    textAlign: "center",
    fontSize: 10,
    color: "#000",
    fontWeight: "600",
    marginHorizontal: 8
  },
  uriText: {
    textAlign: "center",
    marginBottom: 2,
    fontSize: 10,
    color: "#666",
    marginHorizontal: 8
  },
  bottomBar: {
    height: getInset("bottom") + 44,
    paddingBottom: getInset("bottom"),
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f4f4f4",
    borderTopWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)"
  },
  bottombarButton: {
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center"
  },
  progressBar: {
    backgroundColor: BLUE,
    height: 2,
    width: WIDTH
  }
});
