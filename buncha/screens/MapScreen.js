import React, { useRef, useEffect, useState, memo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import MapView from "react-native-maps";
import TopBar, { topBarHeight } from "../components/TopBar";
import Marker from "../components/MapMarker";
import {
  itemTimeForDay,
  itemRemainingAtTime,
  itemRemaining
} from "../utils/Time";
import { useEveryMinute } from "../utils/Hooks";
import MapEventButton from "../components/MapEventButton";
import { ANDROID } from "../utils/Constants";
import emitter from "tiny-emitter/instance";
import MapMarkerList from "../components/MapMarkerList";
import { itemMargin } from "../components/UpNextItem";
import SortBar from "../components/SortBar";
import { tabBarHeight } from "../components/TabBar";
import { useSafeArea } from "react-native-safe-area-context";
import locate, { distanceTo } from "../utils/Locate";

export default () => {
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.container}>
          <MarkerMapView />
          {/* <MapListsView /> */}
          <MapEventButton />
          <IndicatorView />
        </View>
        <TopBar
          style={{ paddingHorizontal: itemMargin }}
          containerStyle={{
            position: "absolute",
            top: 0,
            left: 0
          }}
        />
      </View>
    </View>
  );
};

const MapListsView = () => {
  const [sortHeight, setSortHeight] = useState(0);
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: tabBarHeight
      }}
    >
      <MapMarkerList offset={sortHeight} />
      <SortBar
        onLayout={e => {
          const { height } = e.nativeEvent.layout;
          setSortHeight(height);
        }}
        style={{
          backgroundColor: null
        }}
        contentContainerStyle={{
          paddingTop: 0,
          paddingBottom: 8
        }}
        buttonStyle={{
          paddingVertical: 3,
          paddingRight: 3,
          paddingLeft: 4,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3
        }}
      />
    </View>
  );
};

const IndicatorView = () => {
  const refreshing = useSelector(state => state.events.refreshing);
  if (!refreshing) {
    return null;
  }
  return (
    <View style={styles.loading} pointerEvents="none">
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
};

export const MarkerMapView = memo(() => {
  const insets = useSafeArea();
  const mapView = useRef(null);
  const bounds = useSelector(state => state.events.bounds, shallowEqual);
  const locationEnabled = useSelector(state => state.permissions.location);
  const allMarkers = useSelector(state => state.events.markers, shallowEqual);
  const day = useSelector(state => state.events.day);
  const notNow = useSelector(state => state.events.notNow);
  const now = useSelector(state => state.events.now);
  useEffect(() => {
    if (!bounds) {
      return;
    }

    const coords = [
      {
        latitude: bounds.northeast.lat,
        longitude: bounds.northeast.lng
      },
      {
        latitude: bounds.southwest.lat,
        longitude: bounds.southwest.lng
      }
    ];

    requestAnimationFrame(() => {
      mapView.current.fitToCoordinates(coords, {
        animated: false,
        edgePadding: {
          top: insets.top - 10,
          left: 20,
          right: 20,
          bottom: 0
        }
      });
    });
  }, [bounds]);

  useEffect(() => {
    const fitMarker = async item => {
      let coords;

      if (locationEnabled && distanceTo(item) < 50) {
        const coordinate = {
          latitude: item._source.coordinates[1],
          longitude: item._source.coordinates[0]
        };
        const { coords: userLocation } = await locate();
        coords = [coordinate, userLocation];
      } else {
        const bounds = item._source.viewport;
        coords = [
          {
            latitude: bounds.northeast.lat,
            longitude: bounds.northeast.lng
          },
          {
            latitude: bounds.southwest.lat,
            longitude: bounds.southwest.lng
          }
        ];
      }

      requestAnimationFrame(() => {
        mapView.current.fitToCoordinates(coords, {
          animated: false,
          edgePadding: {
            top: insets.top,
            left: 20,
            right: 20,
            bottom: 10
          }
        });
      });
    };

    emitter.on("fit-marker", fitMarker);

    return () => {
      emitter.off("fit-marker", fitMarker);
    };
  }, [locationEnabled]);

  const [time] = useEveryMinute();
  const androidMapProps = ANDROID
    ? {
        moveOnMarkerPress: false,
        onPress: () => {
          emitter.emit("deselect-marker");
        }
      }
    : {
        onPress: () => {
          emitter.emit("select-marker");
        }
      };
  return (
    <MapView
      ref={mapView}
      style={{ flex: 1 }}
      showsUserLocation={locationEnabled}
      {...androidMapProps}
    >
      {allMarkers.reduce((markers, data) => {
        const { _id } = data;

        let time;

        if (notNow) {
          if (day) {
            try {
              time = itemTimeForDay(data, day);
            } catch (error) {
              return markers;
            }
          } else {
            time = itemRemainingAtTime(data, now);
          }
        } else {
          time = itemRemaining(data);
        }

        const timeText = time.remaining && time.remaining.split(" ")[0];

        const zIndex = allMarkers.length - markers.length;

        const key = `${_id}${timeText}${zIndex}`;

        markers.push(
          <Marker
            color={time.color}
            data={data}
            key={key}
            time={timeText}
            zIndex={zIndex}
          />
        );

        return markers;
      }, [])}
    </MapView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    overflow: "hidden"
  },
  loading: {
    position: "absolute",
    top: topBarHeight + 55,
    alignSelf: "center"
  }
});
