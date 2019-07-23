import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Linking
} from "react-native";
import { makeYesterdayISO, timeRemaining } from "../utils/Time";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { getEvent } from "../store/events";
import moment from "moment";
import ImageGallery from "../components/ImageGallery";
import { WEB, IOS } from "../utils/Constants";
import { getInset } from "../utils/SafeAreaInsets";
import BackButton from "../components/BackButton";
import EventMapView from "../components/EventMapView";
import { Helmet } from "react-helmet";
import EventView from "../components/EventView";
import Link from "../components/Link";
import { RED, GREEN, BLUE, NOW } from "../utils/Colors";

export default ({ navigation }) => {
  const dispatch = useDispatch();
  const iframeRef = useRef(null);

  const id = navigation.getParam("id", null);

  const item = useSelector(state => (id ? state.events.data[id] : null));
  const today = moment().weekday();
  const events = useSelector(state =>
    item && item._source.placeid
      ? state.events.places[item._source.placeid]
          .map(id => state.events.data[id])
          .sort((_a, _b) => {
            let a = _a._source.groupedHours[0].iso - today;
            if (a < 0) {
              a += 7;
            }
            let b = _b._source.groupedHours[0].iso - today;
            if (b < 0) {
              b += 7;
            }
            return a - b;
          })
          .sort((_a, _b) => {
            let a = 0;
            const aISO = makeYesterdayISO(_a._source.days);
            if (aISO) {
              const { ending: aEnding } = timeRemaining(
                _a._source.groupedHours[_a._source.groupedHours.length - 1],
                aISO
              );

              a = aEnding ? 1 : 0;
            }

            let b = 0;
            const bISO = makeYesterdayISO(_b._source.days);
            if (bISO) {
              const { ending: bEnding } = timeRemaining(
                _b._source.groupedHours[_b._source.groupedHours.length - 1],
                bISO
              );

              b = bEnding ? 1 : 0;
            }

            return a - b;
          })
      : []
  );

  useEffect(() => {
    if (!item) {
      dispatch(getEvent(id));
    }
  }, []);

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

  if (!item) {
    return (
      <View style={styles.loading}>
        <Text style={styles.titleText}>Loading Data</Text>
      </View>
    );
  }

  let cityText = item._source.neighborhood || item._source.city;
  if (item.sort && item.sort[item.sort.length - 1]) {
    cityText = `${item.sort[item.sort.length - 1].toFixed(1)} mi · ${cityText}`;
  }

  const narrow = width < 800;

  const containerStyle = {
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
        <Helmet>
          <title>
            {item ? `${item._source.location} - Buncha` : "Loading"}
          </title>
        </Helmet>
      ) : null}
      {WEB ? (
        <View
          style={{
            flex: 1,
            maxHeight: narrow ? 160 : null
          }}
        >
          <iframe
            ref={iframeRef}
            style={{
              flex: 1,
              border: "none",
              borderTop: narrow ? "1px solid #ddd" : "none"
            }}
            src="/map"
          />
          <BackButton style={{ position: "absolute", top: 10, left: 10 }} />
        </View>
      ) : null}
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              padding: 10,
              paddingRight: 5
            }}
          >
            <Text style={styles.titleText}>
              {events.length} event{events.length !== 1 ? "s" : ""}
            </Text>
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
          {events.map((item, index) => {
            return (
              <EventView
                style={{
                  borderTopWidth: 1,
                  borderTopColor: "#e0e0e0",
                  paddingVertical: 10,
                  marginHorizontal: 10
                }}
                item={item}
                index={index}
                key={item._id}
              />
            );
          })}
        </View>
      </ScrollView>
      <EventMapView item={item} />
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    padding: 20
  },
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
    marginHorizontal: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "#f4f4f4",
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center"
  }
});
