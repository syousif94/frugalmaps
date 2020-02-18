import { useEffect, useState } from "react";

let mapKitPromise;

async function initMapKit() {
  const script = document.createElement("script");

  script.src = "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js";

  script.async = true;

  const scriptLoaded = new Promise((resolve, reject) => {
    script.addEventListener("load", () => {
      resolve();
    });
  });

  document.body.appendChild(script);

  await scriptLoaded;

  const mapkit = window.mapkit;

  mapkit.init({
    authorizationCallback: function(done) {
      done(
        "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlZOTk1TREhES1QifQ.eyJpc3MiOiI1RTdENVI3QzgzIiwiaWF0IjoxNTgxMTIwMTIxLCJleHAiOjE5MDUyMDY1MjF9.PQijWle6P3438Emw0qBR2vlMg2fUlGBkIv0C3TwGa_Xjkf-T9skMYKMu1cgv-dEIfydwRZkw0ZlFk8p7_dcQKQ"
      );
    }
  });

  return mapkit;
}

async function getMapKit() {
  if (mapKitPromise) {
    return await mapKitPromise;
  }
  mapKitPromise = initMapKit();
  return await mapKitPromise;
}

export function useMap(mapRef) {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const getMap = async () => {
      const mapkit = await getMapKit();

      const map = new mapkit.Map(mapRef.current, {
        showsZoomControl: false,
        showsMapTypeControl: false
      });

      map.showsCompass = mapkit.FeatureVisibility.Hidden;
      map._allowWheelToZoom = true;

      setMap(map);
    };

    getMap();
  }, [mapRef]);

  return [map];
}
