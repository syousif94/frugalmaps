import React, { useRef, useCallback } from "react";
import emitter from "tiny-emitter/instance";

export const EventListContext = React.createContext(null);

export function EventListProvider({ children }) {
  const page = useRef(0);
  const topItems = useRef({});
  // const itemHeights = useRef({});
  // const [snapOffsets, setSnapOffsets] = useState({});

  const setPage = useCallback(index => {
    page.current = index;
    const item = topItems.current[index];

    if (item) {
      requestAnimationFrame(() => {
        emitter.emit("select-marker", item._source.placeid);
        emitter.emit("fit-marker", item);
      });
    }
  }, []);

  const setTopItem = useCallback((index, item) => {
    topItems.current[index] = item;

    if (index === page.current) {
      emitter.emit("select-marker", item._source.placeid);
      emitter.emit("fit-marker", item);
    }
  }, []);

  // const buildItemLayouts = useCallback(
  //   (index, itemIndex, height) => {
  //     const heights = itemHeights.current[index] || [];
  //     heights[itemIndex] = height;
  //     itemHeights.current[index] = heights;
  //     if (heights.includes(undefined)) {
  //       return;
  //     }

  //     const offsets = heights.reduce(
  //       (offsets, height, index) => {
  //         offsets.push(height + offsets[index]);
  //         return offsets;
  //       },
  //       [0]
  //     );

  //     const nextSnapOffsets = {
  //       ...snapOffsets,
  //       [index]: offsets
  //     };

  //     setSnapOffsets(nextSnapOffsets);
  //   },
  //   [snapOffsets]
  // );

  return (
    <EventListContext.Provider value={[setPage, setTopItem]}>
      {children}
    </EventListContext.Provider>
  );
}
