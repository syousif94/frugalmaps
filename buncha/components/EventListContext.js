import React, { useRef, useCallback } from "react";
import emitter from "tiny-emitter/instance";

export const EventListContext = React.createContext(null);

export function EventListProvider({ children }) {
  const page = useRef(0);
  const topItems = useRef({});

  const setPage = useCallback(index => {
    page.current = index;
    const placeid = topItems.current[index];

    if (placeid) {
      requestAnimationFrame(() => {
        emitter.emit("select-marker", placeid);
      });
    }
  }, []);

  const setTopItem = useCallback((index, placeid) => {
    topItems.current[index] = placeid;

    if (index === page.current) {
      emitter.emit("select-marker", placeid);
    }
  }, []);

  return (
    <EventListContext.Provider value={[setPage, setTopItem]}>
      {children}
    </EventListContext.Provider>
  );
}
