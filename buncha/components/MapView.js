import React, { useRef, useEffect, memo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import MapView from "react-native-maps";
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
import { tabBarHeight } from "../components/TabBar";
import { useSafeArea } from "react-native-safe-area-context";
import locate, { distanceTo } from "../utils/Locate";
import { Dimensions } from "react-native";
import { TAG_LIST_HEIGHT } from "./TagList";

export default memo(() => {
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
          top: ANDROID ? -50 : insets.top - 10,
          left: 20,
          right: 20,
          bottom: TAG_LIST_HEIGHT
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
            top: ANDROID ? -50 : insets.top - 10,
            left: 20,
            right: 20,
            bottom: TAG_LIST_HEIGHT
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

        const key = `${_id}${timeText}`;

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
