import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import MapView from "react-native-maps";
import TopBar from "../components/TopBar";
import Marker from "../components/MapMarker";
import { timeRemaining, makeISO, makeYesterdayISO } from "../utils/Time";
import SortBar from "../components/SortBar";
import { useCitiesToggle } from "../utils/Hooks";
import CityList from "../components/CityList";
import MapEventButton from "../components/MapEventButton";
import { ANDROID } from "../utils/Constants";
import emitter from "tiny-emitter/instance";

export default () => {
  const mapView = useRef(null);
  const bounds = useSelector(state => state.events.bounds);
  const locationEnabled = useSelector(state => state.permissions.location);
  const refreshing = useSelector(state => state.events.refreshing);
  const markers = useSelector(state => state.events.markers);
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
          top: 50,
          left: 50,
          right: 50,
          bottom: 50
        }
      });
    });
  }, [bounds]);

  const [citiesTranslate, toggleCities] = useCitiesToggle();

  const androidMapProps = ANDROID
    ? {
        moveOnMarkerPress: false,
        onPress: () => {
          emitter.emit("deselect-marker");
        }
      }
    : {};

  return (
    <View style={styles.container}>
      <TopBar rotate={citiesTranslate.current} toggle={toggleCities} />
      <View style={styles.container}>
        <View style={styles.container}>
          <MapView
            ref={mapView}
            style={{ flex: 1 }}
            showsUserLocation={locationEnabled}
            {...androidMapProps}
          >
            {markers.map(data => {
              const { _id, _source: item } = data;

              const iso = makeISO(item.days);

              const hours = item.groupedHours.find(group =>
                group.days.find(day => day.iso === iso)
              );

              let { ending, ended } = timeRemaining(hours, iso);

              if (!ending && item.groupedHours.length > 1) {
                const yesterdayISO = makeYesterdayISO(item.days);
                const hours = item.groupedHours.find(group =>
                  group.days.find(day => day.iso === yesterdayISO)
                );
                if (hours) {
                  const { ending: endingYesterday } = timeRemaining(
                    hours,
                    yesterdayISO
                  );
                  ending = endingYesterday;
                }
              }

              const upcoming = hours.today && !ended && !ending;

              const key = `${upcoming}${ending}${_id}`;

              return (
                <Marker
                  upcoming={upcoming}
                  ending={ending}
                  data={data}
                  key={key}
                />
              );
            })}
          </MapView>
          <MapEventButton />
          {refreshing ? (
            <View style={styles.loading} pointerEvents="none">
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : null}
        </View>
        <SortBar style={{ borderTopWidth: 1, borderTopColor: "#e0e0e0" }} />
        <CityList translateY={citiesTranslate.current} toggle={toggleCities} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    overflow: "hidden"
  },
  loading: {
    position: "absolute",
    top: 50,
    alignSelf: "center"
  }
});