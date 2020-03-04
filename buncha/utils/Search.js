import React, { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import _ from "lodash";
import { useSelector, shallowEqual } from "react-redux";
import { itemRemaining } from "./Time";
import { UPCOMING, NOW, NOT_TODAY } from "./Colors";

export const SearchContext = React.createContext(null);

export function SearchProvider({ children }) {
  const [filter, setFilter, list] = useSearch();
  return (
    <SearchContext.Provider value={[filter, setFilter, list]}>
      {children}
    </SearchContext.Provider>
  );
}

function useSearch() {
  const [filter, setFilter] = useState("");
  const items = useRef([]);
  const fuseRef = useRef(null);
  const [list, setList] = useState([]);

  const [tags] = useTags();
  const [cities] = useCities();
  const [places] = usePlaces();

  useEffect(() => {
    items.current = [...tags, ...places, ...cities];

    setList(items.current);

    fuseRef.current = new Fuse(items.current, {
      caseSensitive: false,
      shouldSort: true,
      findAllMatches: false,
      includeMatches: true,
      threshold: 0.3,
      distance: 20,
      keys: ["text"]
    });
  }, [tags, cities, places]);

  useEffect(() => {
    if (!filter || !filter.length) {
      setList(items.current);
    } else if (fuseRef.current) {
      setList(fuseRef.current.search(filter));
    }
  }, [filter]);

  return [filter, setFilter, list];
}

function useCities() {
  const [list, setList] = useState([]);

  const cities = useSelector(
    state =>
      state.cities.error || !state.cities.closest.length
        ? state.cities.popular
        : state.cities.closest,
    shallowEqual
  );

  useEffect(() => {
    setList(
      cities.map(city => {
        return {
          type: "city",
          text: city._source.name,
          city
        };
      })
    );
  }, [cities]);

  return [list];
}

function usePlaces() {
  const [list, setList] = useState([]);

  const places = useSelector(state => state.events.places, shallowEqual);
  const data = useSelector(state => state.events.data, shallowEqual);

  useEffect(() => {
    setList(
      Object.values(places)
        .map(keys => {
          const events = keys.map(key => data[key]);
          return {
            type: "place",
            text: events[0]._source.location,
            events
          };
        })
        .sort((a, b) => {
          const aText = a.text.toLowerCase();
          const bText = b.text.toLowerCase();
          if (aText < bText) {
            return -1;
          }
          if (aText > bText) {
            return 1;
          }
          return 0;
        })
    );
  }, [places, data]);

  return [list];
}

function useTags() {
  const [tags, setTags] = useState([]);

  const occurringTags = useSelector(state => state.events.occurringTags);
  const countedTags = useSelector(state => state.events.tags, shallowEqual);
  const data = useSelector(state => state.events.data, shallowEqual);
  const tagsCount = _.keyBy(countedTags, "text");

  useEffect(() => {
    setTags(makeTags(occurringTags, countedTags, data, tagsCount));
  }, [occurringTags, countedTags, data]);

  return [tags];
}

function makeTags(occurringTags, countedTags, data, tagsCount) {
  if (occurringTags && countedTags.length) {
    const keys = _.uniq([
      ...Object.keys(occurringTags.ending),
      ...Object.keys(occurringTags.upcoming),
      ...Object.keys(occurringTags.remaining)
    ]);

    return keys.map(key => {
      const ending = occurringTags.ending[key]
        ? occurringTags.ending[key].length
        : 0;

      let upcoming = occurringTags.upcoming[key]
        ? occurringTags.upcoming[key].length
        : 0;

      let item;

      if (ending) {
        const keys = occurringTags.ending[key];
        if (keys) {
          const key = keys[keys.length - 1];
          item = data[key];
        }
      } else if (upcoming) {
        const upcomingKeys = occurringTags.upcoming[key];
        if (upcomingKeys) {
          const key = upcomingKeys[0];
          item = data[key];
        }
      } else {
        const keys = occurringTags.remaining[key];
        if (keys) {
          const key = keys[0];
          item = data[key];
        }
      }

      return {
        type: "tag",
        text: key,
        tag: {
          count: tagsCount[key].count,
          upcoming,
          ending,
          item
        }
      };
    });
  }

  return [];
}

export function getItemText(item) {
  switch (item.type) {
    case "tag":
      return getTagTime(item.tag);
    default:
      return null;
  }
}

export function getItemCount(item) {
  switch (item.type) {
    case "tag":
      return item.tag.count;
    case "city":
      return item.city._source.count;
    case "place":
      return item.events.length;
    default:
      return null;
  }
}

function getTagTime({ item, upcoming, ending }) {
  if (!item) {
    return null;
  }

  if (ending) {
    const { status } = itemRemaining(item);
    return { text: status.split(" ")[0], color: NOW };
  } else if (upcoming) {
    const { text } = itemRemaining(item);
    return { text: text.replace(" today", ""), color: UPCOMING };
  } else {
    const { status, upcoming: u, start } = itemRemaining(item);
    if (u) {
      return { text: start, color: UPCOMING };
    } else {
      return { text: status.split(" ")[0], color: NOT_TODAY };
    }
  }
}
