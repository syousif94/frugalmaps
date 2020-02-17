import React, { useRef, useEffect } from "react";
import { useMap } from "../utils/MapKit";
import { View } from "react-native";

export default ({ events }) => {
  const item = events[0];

  const mapRef = useRef(null);

  const [map] = useMap(mapRef);

  useEffect(() => {
    if (!map) {
      return;
    }

    const bounds = item._source.viewport;

    const region = new mapkit.BoundingRegion(
      bounds.northeast.lat,
      bounds.northeast.lng,
      bounds.southwest.lat,
      bounds.southwest.lng
    ).toCoordinateRegion();

    requestAnimationFrame(() => {
      map.region = region;
    });
  }, [map]);

  return (
    <View style={{ flex: 1 }}>
      <div style={{ flex: 1 }} ref={mapRef} />
    </View>
  );
};

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
