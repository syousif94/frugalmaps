import React, { useRef, useState, useEffect } from "react";
import { View } from "react-native";

export default ({ style, place }) => {
  const iframeRef = useRef(null);
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    if (iframeRef.current && !iframeRef.current.onload) {
      iframeRef.current.onload = () => {
        setIframeReady(true);
      };
    }
  }, [place]);

  useEffect(() => {
    if (iframeReady && place) {
      requestAnimationFrame(() => {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            _source: {
              coordinates: [
                place.geometry.location.lng,
                place.geometry.location.lat
              ]
            }
          }),
          window.location.origin
        );
      });
    }
  }, [iframeReady, place]);

  return (
    <View style={style} pointerEvents="none">
      <iframe
        ref={iframeRef}
        style={{
          backgroundColor: "#fff",
          flex: 1,
          border: "none"
        }}
        src="/map"
      />
    </View>
  );
};
