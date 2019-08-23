import React, { useEffect, memo, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Linking
} from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { selectPlaceEvents } from "../store/events";
import ImageGallery from "../components/ImageGallery";
import { WEB, IOS, HEIGHT } from "../utils/Constants";
import { getInset } from "../utils/SafeAreaInsets";
import BackButton from "../components/BackButton";
import EventView from "../components/EventView";
import Link from "../components/Link";
import { RED, BLUE, NOW } from "../utils/Colors";
import { distanceTo, roundedDistanceTo } from "../utils/Locate";

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
    maxWidth: narrow ? null : 450,
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
        <View style={{ flexDirection: "row" }}>
          <ScrollView horizontal>
            <Link
              style={[styles.link, { marginLeft: 15 }]}
              onPress={() => {
                Linking.openURL(`tel:${item._source.phone}`);
              }}
            >
              <FontAwesome
                style={{ marginTop: 1 }}
                name="phone"
                size={14}
                color={NOW}
              />
              <Text style={[styles.titleText, { marginLeft: 6 }]}>Call</Text>
            </Link>
            <Link
              to={item._source.website}
              style={styles.link}
              onPress={() => {
                if (WEB) {
                  window.open(item._source.website, "_blank");
                } else {
                  Linking.openURL(item._source.website);
                }
              }}
            >
              <Entypo
                style={{ marginTop: 1.5 }}
                name="link"
                size={14}
                color={BLUE}
              />
              <Text style={[styles.titleText, { marginLeft: 6 }]}>Website</Text>
            </Link>
            <Link
              style={styles.link}
              onPress={() => {
                if (WEB) {
                  window.open(item._source.url, "_blank");
                } else {
                  Linking.openURL(item._source.url);
                }
              }}
            >
              <FontAwesome name="map-marker" size={14} color={RED} />
              <Text style={[styles.titleText, { marginLeft: 6 }]}>
                Google Maps
              </Text>
            </Link>
          </ScrollView>
        </View>
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
    maxWidth: 500,
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
  },
  link: {
    marginBottom: 10,
    marginHorizontal: 5,
    paddingHorizontal: 15,
    backgroundColor: "#f4f4f4",
    height: HEIGHT * 0.05,
    flexDirection: "row",
    alignItems: "center"
  }
});
