import React, { useEffect, memo, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { selectPlaceEvents } from "../store/events";
import ImageGallery from "../components/ImageGallery";
import { WEB, IOS } from "../utils/Constants";
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

export default memo(({ item, id }) => {
  const events = useSelector(selectPlaceEvents(item));
  const iframeRef = useRef(null);
  const [iframeReady, setIframeReady] = useState(false);

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

  const [width, setWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const onChange = ({ window }) => {
      setWidth(window.width);
    };

    Dimensions.addEventListener("change", onChange);

    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  let cityText = item._source.neighborhood || item._source.city;
  const distance = roundedDistanceTo(item);
  if (distance) {
    cityText = `${distance}${cityText}`;
  }

  const narrow = width < 800;

  const containerStyle = {
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: narrow ? (WEB ? "column-reverse" : null) : "row"
  };

  const scrollViewStyle = {
    maxWidth: narrow || !WEB ? null : 450,
    flex: 1
  };

  return (
    <View style={containerStyle}>
      {WEB ? (
        <View
          style={{
            flex: narrow ? 0 : 1,
            visibility: narrow ? "hidden" : null,
            backgroundColor: "#fff"
          }}
        >
          <iframe
            ref={iframeRef}
            style={{
              backgroundColor: "#fff",
              flex: 1,
              border: "none",
              borderTop: narrow ? "1px solid #ddd" : "none"
            }}
            src="/map"
          />
          <BackButton style={{ position: "absolute", top: 10, left: 10 }} />
        </View>
      ) : null}
      <View style={scrollViewStyle}>
        <ScrollView
          style={scrollViewStyle}
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={styles.content}
        >
          <View style={[styles.info, { padding: 10 }]}>
            <View style={[styles.row]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.locationText}>{item._source.location}</Text>
                <Text style={styles.detailText}>{cityText}</Text>
              </View>
              <View style={styles.rating}>
                <FontAwesome name="star" size={14} color="#FFA033" />
                <Text style={styles.ratingText}>
                  {parseFloat(item._source.rating, 10).toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
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
        </ScrollView>
        <DetailActions item={item} />
        {!WEB ? <MapView item={item} /> : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  content: {
    paddingTop: IOS ? getInset("top") : null,
    paddingBottom: 10
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
    fontSize: 14,
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
