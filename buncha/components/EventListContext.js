import React, { useRef, useCallback } from "react";
import { Dimensions } from "react-native";
import emitter from "tiny-emitter/instance";

export const EventListContext = React.createContext(null);

export function EventListProvider({ children }) {
  const verticalOffset = useRef(0);
  const scrollEnabled = useRef(false);
  const page = useRef(0);

  const setPage = useCallback(index => {
    page.current = index;
  }, []);

  const setVerticalOffset = useCallback(offset => {
    verticalOffset.current = offset;
    const topOffset = Math.floor(Dimensions.get("window").height * 0.6);
    const enabled = Math.ceil(verticalOffset.current) >= topOffset;
    if (enabled !== scrollEnabled.current) {
      emitter.emit("scroll-enabled", enabled);
      scrollEnabled.current = enabled;
    }
  }, []);

  return (
    <EventListContext.Provider value={[setPage, setVerticalOffset]}>
      {children}
    </EventListContext.Provider>
  );
}
