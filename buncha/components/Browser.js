import React, { useRef, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  Animated,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking
} from "react-native";
import { WebView } from "react-native-webview";
import { useAnimateOn } from "../utils/Hooks";
import { HEIGHT, WIDTH, ANDROID } from "../utils/Constants";
import { getInset } from "../utils/SafeAreaInsets";
import { BLUE } from "../utils/Colors";
import { Feather } from "@expo/vector-icons";
import * as Browser from "../store/browser";

let height = HEIGHT - getInset("top");
if (ANDROID) {
  height += 20;
}

export default () => {
  const progress = useRef(new Animated.Value(0));
  const webViewRef = useRef(null);
  const [navDirections, setNavDirections] = useState({
    pop: false,
    push: false
  });
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
            ref={webViewRef}
            source={{ uri }}
            style={styles.webView}
            allowsBackForwardNavigationGestures
            allowsInlineMediaPlayback
            decelerationRate="normal"
            onLoadStart={() => {
              progress.current.setValue(0.1);
            }}
            onLoadProgress={({ nativeEvent }) => {
              setTitle(nativeEvent.title);
              progress.current.setValue(nativeEvent.progress);
            }}
            onLoadEnd={({ nativeEvent }) => {
              setTitle(nativeEvent.title || "No Title");
              progress.current.setValue(0);
            }}
            onNavigationStateChange={({
              canGoBack: pop,
              canGoForward: push
            }) => {
              setNavDirections({
                pop,
                push
              });
            }}
          />
        ) : null}
        <BottomBar
          url={uri}
          webViewRef={webViewRef}
          navDirections={navDirections}
        />
      </Animated.View>
    </View>
  );
};

const BottomBar = ({ navDirections, webViewRef, url }) => {
  const dispatch = useDispatch();
  const mode = useSelector(state => state.browser.mode, shallowEqual);
  switch (mode) {
    case Browser.MODES[0]:
      return (
        <View style={styles.bottomBar}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.bottombarButton}
              onPress={() => {
                webViewRef.current.goBack();
              }}
              disabled={!navDirections.pop}
            >
              <Feather
                name="chevron-left"
                color={navDirections.pop ? BLUE : "#ccc"}
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottombarButton}
              onPress={() => {
                webViewRef.current.goForward();
              }}
              disabled={!navDirections.push}
            >
              <Feather
                name="chevron-right"
                color={navDirections.push ? BLUE : "#ccc"}
                size={24}
              />
            </TouchableOpacity>
          </View>
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
            <Text
              style={{
                color: BLUE,
                fontSize: 14,
                fontWeight: "500"
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            <TouchableOpacity
              style={styles.bottombarButton}
              onPress={async () => {
                await Linking.openURL(url);
              }}
            >
              <Feather name="external-link" color={BLUE} size={20} />
            </TouchableOpacity>
          </View>
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
    backgroundColor: "#f4f4f4",
    borderTopWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)"
  },
  bottombarButton: {
    height: 44,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  progressBar: {
    backgroundColor: BLUE,
    height: 2,
    width: WIDTH
  }
});
