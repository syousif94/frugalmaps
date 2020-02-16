import React, { useRef, useEffect, useLayoutEffect } from "react";
import { View, Dimensions } from "react-native";
import { useMap } from "../utils/MapKit";
import { useSelector, shallowEqual } from "react-redux";
import { useEveryMinute, useDimensions } from "../utils/Hooks";
import {
  itemTimeForDay,
  itemRemainingAtTime,
  itemRemaining
} from "../utils/Time";
import emitter from "tiny-emitter/instance";
import { navigate } from "../screens";
import _ from "lodash";
import store from "../store";

export default ({}) => {
  const mapRef = useRef(null);

  const [map] = useMap(mapRef);

  const [time] = useEveryMinute();
  const bounds = useSelector(state => state.events.bounds, shallowEqual);
  const allMarkers = useSelector(state => state.events.markers, shallowEqual);
  const day = useSelector(state => state.events.day);
  const notNow = useSelector(state => state.events.notNow);
  const now = useSelector(state => state.events.now);

  useEffect(() => {
    if (!bounds || !map) {
      return;
    }

    const region = new mapkit.BoundingRegion(
      bounds.northeast.lat,
      bounds.northeast.lng,
      bounds.southwest.lat,
      bounds.southwest.lng
    ).toCoordinateRegion();

    requestAnimationFrame(() => {
      map.region = region;
    });
  }, [bounds, map]);

  useMarkers(map, allMarkers, day, notNow, now, time);

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <div style={{ flex: 1 }} ref={mapRef} />
    </View>
  );
};

function useMarkers(map, allMarkers, day, notNow, now, currentTime) {
  const annotationMap = useRef(new Map());

  useEffect(() => {
    if (!map) {
      return;
    }

    const selectMarker = item => {
      const annotation = annotationMap.current.get(item._source.placeid);

      if (!annotation || annotation.selected) {
        return;
      }

      annotation.selected = true;
    };

    const deselectMarker = e => {
      setTimeout(() => {
        if (Dimensions.get("window").width > 850) {
          if (_.startsWith(location.pathname, "/e/")) {
            const id = location.pathname.replace("/e/", "");
            const placeid = store.getState().events.data[id]._source.placeid;
            const annotation = annotationMap.current.get(placeid);

            if (!annotation || annotation.selected) {
              return;
            }

            annotation.selected = true;
          } else {
            map.selectedAnnotation = null;
          }
        }
      }, 32);
    };

    emitter.on("select-marker", selectMarker);

    window.addEventListener("popstate", deselectMarker);

    return () => {
      emitter.off("select-marker", selectMarker);
      window.removeEventListener("popstate", deselectMarker);
    };
  }, [map]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const newAnnotations = allMarkers.reduce((markers, data) => {
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

      markers.set(
        data._source.placeid,
        makeAnnotation({
          marker: data,
          color: time.color,
          time: timeText
        })
      );

      return markers;
    }, new Map());

    let removeable = [];

    for (const [id, annotation] of annotationMap.current) {
      const newAnnotation = newAnnotations.get(id);

      if (newAnnotation) {
        annotation.data = newAnnotation.data;
        updateAnnotation(annotation);
        newAnnotations.delete(id);
      } else {
        removeable.push(annotation);
        annotationMap.current.delete(id);
      }
    }

    annotationMap.current = new Map([
      ...annotationMap.current,
      ...newAnnotations
    ]);

    removeAnnotations(map, removeable);
    addAnnotations(map, newAnnotations);
  }, [map, allMarkers, day, notNow, now, currentTime]);
}

function annotationFactory(coordinate, options) {
  const time = options.data.time;
  const color = options.data.color;
  const title = options.title;

  const div = document.createElement("div");
  div.style = `height: 60px; width: 60px; border-radius: 30px; background-color: ${color}; position: relative; display: flex; flex-direction: column; cursor: pointer; transform: scale(0.5); align-items: center; justify-content: center; font-weight: 700; color: #fff; font-size: 17px;`;

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
  annotation.anchorOffset = new window.DOMPoint(15, 18);

  return annotation;
}

function updateAnnotation(annotation) {
  const el = annotation.element;
  const data = annotation.data;
  el.style.backgroundColor = data.color;
  const chevron = el.querySelector(".marker-chevron");
  chevron.style.backgroundColor = data.color;
  const subText = el.querySelector(".marker-subtext");
  subText.innerText = data.time;
}

function onAnnotationSelected(e) {
  const annotation = e.target;
  const el = annotation.element;
  el.style.transform = "scale(1)";
  annotation.anchorOffset = new window.DOMPoint(15, 36);

  const data = annotation.data;
  const path = window.location.pathname;
  const { width } = Dimensions.get("window");

  if (width > 850) {
    const paths = data.marker.events.map(e => `/e/${e._id}`);
    if (!paths.includes(path)) {
      navigate("Detail", { id: data.marker.events[0]._id });
    }
  }
}

function onAnnotationDeselected(e) {
  const annotation = e.target;
  const el = annotation.element;
  el.style.transform = "scale(0.5)";
  annotation.anchorOffset = new window.DOMPoint(15, 18);

  const path = window.location.pathname;
  const { width } = Dimensions.get("window");

  setTimeout(() => {
    const selectedAnnotation = annotation.map.selectedAnnotation;

    if (selectedAnnotation) {
      return;
    }

    if (width > 850 && path !== "/") {
      navigate("UpNext");
    }
  }, 32);
}

function addAnnotations(map, annotationMap) {
  const annotations = Array.from(annotationMap.values());
  map.addAnnotations(annotations);
  annotations.forEach(annotation => {
    annotation.addEventListener("select", onAnnotationSelected);
    annotation.addEventListener("deselect", onAnnotationDeselected);
  });
}

function removeAnnotations(map, annotations) {
  map.removeAnnotations(annotations);
  annotations.forEach(annotation => {
    annotation.removeEventListener("select", onAnnotationSelected);
    annotation.removeEventListener("deselect", onAnnotationDeselected);
  });
}
