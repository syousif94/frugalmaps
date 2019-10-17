import React, { useEffect, memo, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { View, StyleSheet, Text, Dimensions, Animated } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { selectPlaceEvents } from "../store/events";
import ImageGallery from "../components/ImageGallery";
import { WEB, HEIGHT, ANDROID } from "../utils/Constants";
import { getInset } from "../utils/SafeAreaInsets";
import BackButton from "../components/BackButton";
import EventView from "../components/EventView";
import { roundedDistanceTo } from "../utils/Locate";
import DetailActions from "./DetailActions";

let MapView = null;
if (!WEB) {
  MapView = require("./EventMapView").default;
}

let bottomInset = getInset("bottom");

if (bottomInset === 0) {
  bottomInset = 6;
} else if (bottomInset > 25) {
  bottomInset -= 10;
}

const mapViewHeight = WEB ? 0 : HEIGHT * 0.76;

const mapMinHeight = 190;

const contentMinHeight = HEIGHT - mapMinHeight;

let initialOffset = mapViewHeight - mapMinHeight;

function makeNarrowWebMapOffset(dimensions) {
  return dimensions.height * 0.7;
}

export default memo(({ item, id }) => {
  const events = useSelector(selectPlaceEvents(item));
  const iframeRef = useRef(null);
  const [iframeReady, setIframeReady] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  if (WEB) {
    initialOffset =
      makeNarrowWebMapOffset(dimensions) - dimensions.height * 0.15;
  }
  const scrollOffset = useRef(new Animated.Value(initialOffset));
  const scrollRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current && !iframeRef.current.onload) {
      iframeRef.current.onload = () => {
        setIframeReady(true);
      };
    }
  }, [item]);

  useEffect(() => {
    if (iframeReady && item) {
      requestAnimationFrame(() => {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify(item),
          window.location.origin
        );
      });
    }
  }, [iframeReady, item]);

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    Dimensions.addEventListener("change", onChange);

    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    const scroll = () => {
      scrollRef.current
        .getNode()
        .scrollTo({ y: initialOffset, animated: false });
    };
    if (ANDROID) {
      requestAnimationFrame(scroll);
    } else if (WEB) {
      scroll();
    }
  }, []);

  let cityText = item._source.neighborhood || item._source.city;
  const distance = roundedDistanceTo(item);
  if (distance) {
    cityText = `${distance} ${cityText}`;
  }

  const narrow = dimensions.width < 800;

  const containerStyle = {
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: narrow ? (WEB ? "column" : null) : "row-reverse"
  };

  const scrollViewStyle = {
    maxWidth: narrow || !WEB ? null : 450,
    flex: 1
  };

  const scrollProps = WEB
    ? {
        onScroll: e => {
          const offset = e.nativeEvent.contentOffset.y;
          scrollOffset.current.setValue(offset);
        },
        scrollEventThrottle: 16,
        contentContainerStyle: {
          paddingTop: narrow ? dimensions.height * 0.7 : null
        }
      }
    : {
        onScroll: Animated.event([
          { nativeEvent: { contentOffset: { y: scrollOffset.current } } }
        ])
      };

  return (
    <View style={containerStyle}>
      <View style={scrollViewStyle}>
        <Animated.ScrollView
          style={scrollViewStyle}
          ref={scrollRef}
          contentInsetAdjustmentBehavior="never"
          contentOffset={{ x: 0, y: initialOffset }}
          {...scrollProps}
        >
          {!WEB ? (
            <MapView
              item={item}
              style={{
                height: mapViewHeight,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                transform: [
                  {
                    translateY: scrollOffset.current.interpolate({
                      inputRange: [0, initialOffset],
                      outputRange: [0, (mapViewHeight - mapMinHeight) / 2],
                      extrapolate: "clamp"
                    })
                  }
                ]
              }}
            />
          ) : null}
          <View style={styles.content}>
            <View style={[styles.info, { padding: 10, paddingBottom: 0 }]}>
              <View style={[styles.row]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationText}>
                    {item._source.location}
                  </Text>
                  <Text style={styles.detailText}>{cityText}</Text>
                </View>
                <View style={styles.rating}>
                  <FontAwesome name="star" size={18} color="#FFA033" />
                  <Text style={styles.ratingText}>
                    {parseFloat(item._source.rating, 10).toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
            <DetailActions item={item} />
            <ImageGallery photos={item._source.photos} />
            <View style={styles.info}>
              {events.map((item, index) => {
                return (
                  <EventView
                    description
                    style={{
                      borderBottomWidth: 1,
                      borderColor: "#f2f2f2",
                      paddingHorizontal: 10,
                      paddingTop: 8,
                      backgroundColor: item._id === id ? "#fafafa" : "#fff"
                    }}
                    item={item}
                    index={index}
                    key={item._id}
                  />
                );
              })}
            </View>
          </View>
        </Animated.ScrollView>
      </View>
      {WEB ? (
        <Animated.View
          style={{
            flex: narrow ? null : 1,
            backgroundColor: "#fff",
            position: narrow ? "absolute" : null,
            top: narrow ? 0 : null,
            left: narrow ? 0 : null,
            right: narrow ? 0 : null,
            height: narrow
              ? scrollOffset.current.interpolate({
                  inputRange: [0, makeNarrowWebMapOffset(dimensions)],
                  outputRange: [
                    scrollProps.contentContainerStyle.paddingTop,
                    0
                  ],
                  extrapolate: "clamp"
                })
              : null,
            overflow: "hidden"
          }}
        >
          <iframe
            ref={iframeRef}
            style={{
              backgroundColor: "#fff",
              flex: narrow ? null : 1,
              height: narrow
                ? scrollProps.contentContainerStyle.paddingTop
                : null,
              border: "none",
              borderTop: narrow ? "1px solid #ddd" : "none"
            }}
            src="/map"
          />
          <BackButton style={{ position: "absolute", top: 10, left: 10 }} />
        </Animated.View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  content: {
    paddingBottom: getInset("bottom") + 70,
    minHeight: WEB ? null : contentMinHeight,
    marginTop: WEB ? null : mapViewHeight,
    backgroundColor: "#fff"
  },
  info: {
    width: "100%",
    maxWidth: WEB ? 500 : null,
    alignSelf: "center"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600"
  },
  locationText: {
    fontSize: 22,
    fontWeight: "600"
  },
  detailText: {
    fontSize: 12,
    color: "#444"
  },
  rating: {
    flexDirection: "row",
    alignItems: "center"
  },
  ratingText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 5
  },
  additional: {
    marginLeft: 4,
    backgroundColor: "#bbb",
    paddingHorizontal: 2,
    borderRadius: 3,
    alignItems: "center"
  },
  additionalText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700"
  },
  descriptionText: {
    marginTop: 5,
    color: "#000",
    fontSize: 14
  }
});
