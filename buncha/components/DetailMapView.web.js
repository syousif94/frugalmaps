import React, { useRef, useEffect, useState } from "react";
import { useMap } from "../utils/MapKit";
import { View } from "react-native";
import {
  itemTimeForDay,
  itemRemainingAtTime,
  itemRemaining
} from "../utils/Time";
import { useSelector } from "react-redux";
import { useEveryMinute } from "../utils/Hooks";
import locate, { calculateDistance } from "../utils/Locate";

export default ({ events, preloaded }) => {
  const userCoords = useRef(null);
  const [located, setLocated] = useState(false);
  const locationEnabled = useSelector(state => state.permissions.location);

  const item = events[0];

  const mapRef = useRef(null);

  const [map] = useMap(mapRef);

  const day = useSelector(state => state.events.day);
  const notNow = useSelector(state => state.events.notNow);
  const now = useSelector(state => state.events.now);
  const [currentTime] = useEveryMinute();

  const annotation = useRef(null);

  useEffect(() => {
    if (map && (!preloaded || locationEnabled)) {
      const getLocation = async () => {
        try {
          const { coords } = await locate();
          userCoords.current = coords;
        } catch (error) {
          console.log(error);
        }
        setLocated(true);
      };

      getLocation();
    }
  }, [map]);

  useEffect(() => {
    if (!map) {
      return;
    }

    if (locationEnabled || (!preloaded && located && userCoords.current)) {
      map.showsUserLocation = true;
    }
  }, [located, locationEnabled, map, preloaded]);

  useEffect(() => {
    if (!map || !located) {
      return;
    }

    let region;

    let distance;

    const itemCoords = item._source.coordinates;

    if (userCoords.current) {
      distance = calculateDistance(
        userCoords.current.latitude,
        userCoords.current.longitude,
        itemCoords[1],
        itemCoords[0]
      );
    }

    if (distance !== undefined && distance < 50) {
      const coords = [0, 0, 0, 0];

      if (userCoords.current.latitude > itemCoords[1]) {
        coords[0] = userCoords.current.latitude;
        coords[2] = itemCoords[1];
      } else {
        coords[0] = itemCoords[1];
        coords[2] = userCoords.current.latitude;
      }

      if (userCoords.current.longitude > itemCoords[0]) {
        coords[1] = userCoords.current.longitude;
        coords[3] = itemCoords[0];
      } else {
        coords[1] = itemCoords[0];
        coords[3] = userCoords.current.longitude;
      }

      region = new mapkit.BoundingRegion(...coords).toCoordinateRegion();

      region.span = new mapkit.CoordinateSpan(
        region.span.latitudeDelta * 1.3,
        region.span.longitudeDelta * 1.3
      );
    } else {
      const bounds = item._source.viewport;

      region = new mapkit.BoundingRegion(
        bounds.northeast.lat,
        bounds.northeast.lng,
        bounds.southwest.lat,
        bounds.southwest.lng
      ).toCoordinateRegion();
    }

    requestAnimationFrame(() => {
      map.region = region;
    });
  }, [map, item, located]);

  useEffect(() => {
    if (!map || !item) {
      return;
    }

    let time;

    if (notNow) {
      if (day) {
        try {
          time = itemTimeForDay(item, day);
        } catch (error) {
          return;
        }
      } else {
        time = itemRemainingAtTime(item, now);
      }
    } else {
      time = itemRemaining(item);
    }

    const timeText = time.remaining && time.remaining.split(" ")[0];

    const data = {
      marker: item,
      color: time.color,
      time: timeText
    };

    if (annotation.current) {
      annotation.current.data = data;
      updateAnnotation(annotation.current);
    } else {
      annotation.current = makeAnnotation(data);

      map.addAnnotation(annotation.current);
    }
  }, [map, events, currentTime, item]);

  return (
    <View style={{ flex: 1 }}>
      <div style={{ flex: 1 }} ref={mapRef} />
    </View>
  );
};

function updateAnnotation(annotation) {
  const el = annotation.element;
  const data = annotation.data;
  el.style.backgroundColor = data.color;
  const chevron = el.querySelector(".marker-chevron");
  chevron.style.backgroundColor = data.color;
  const subText = el.querySelector(".marker-subtext");
  subText.innerText = data.time;
}

function annotationFactory(coordinate, options) {
  const time = options.data.time;
  const color = options.data.color;
  const title = options.title;

  const div = document.createElement("div");
  div.style = `height: 60px; width: 60px; border-radius: 30px; background-color: ${color}; position: relative; display: flex; flex-direction: column; cursor: pointer; align-items: center; justify-content: center; font-weight: 700; color: #fff; font-size: 17px;`;

  const chevronDiv = document.createElement("div");
  chevronDiv.classList.add("marker-chevron");
  chevronDiv.style = `position: absolute; align-self: center; height: 12px; width: 12px; background-color: ${color}; transform: rotate(45deg); bottom: -4px; z-index: 1`;
  div.appendChild(chevronDiv);

  const titleText = document.createElement("div");
  titleText.classList.add("marker-title");
  titleText.innerText = title.replace(/^(the |a )/gi, "").substr(0, 4);
  titleText.style = "margin-top: -2px";
  div.appendChild(titleText);

  const subText = document.createElement("div");
  subText.classList.add("marker-subtext");
  subText.innerText = time;
  subText.style = "margin-top: -2px";
  div.appendChild(subText);

  return div;
}

function makeAnnotation(data) {
  const options = {
    title: data.marker._source.location,
    data
  };

  const coordinate = new mapkit.Coordinate(
    data.marker._source.coordinates[1],
    data.marker._source.coordinates[0]
  );

  const annotation = new mapkit.Annotation(
    coordinate,
    annotationFactory,
    options
  );

  annotation.calloutEnabled = false;

  return annotation;
}
