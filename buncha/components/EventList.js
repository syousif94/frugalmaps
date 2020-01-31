import React, { useRef, memo, useEffect, useCallback, useContext } from "react";
import {
  View,
  StyleSheet,
  Animated,
  FlatList,
  Dimensions,
  ScrollView
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import UpNextItem, { itemMargin } from "./UpNextItem";
import { useDimensions } from "../utils/Hooks";
import _ from "lodash";
import EventListBar from "./EventListBar";
import AccountScreen from "../screens/AccountScreen";
import emitter from "tiny-emitter/instance";
import { itemRemaining } from "../utils/Time";
import SearchList from "./SearchList";
import * as Events from "../store/events";
import { EventListContext, EventListProvider } from "./EventListContext";
import { MarkerMapView } from "../screens/MapScreen";

export const EXPOSED_LIST = 200;

const EventList = memo(() => {
  const panelRef = useRef(null);
  const listRef = useRef(null);
  const footerRef = useRef(null);
  const [dimensions] = useDimensions();
  const initialOffset = dimensions.width * 2;
  const scrollOffset = useRef(new Animated.Value(initialOffset));
  const [
    onPagerBeginDrag,
    onPagerScroll,
    onFooterScroll,
    onPagerScrollEnd,
    layouts
  ] = useSynchronizePager(footerRef);

  const [, setVerticalOffset] = useContext(EventListContext);

  const occurringTags = useSelector(
    state => state.events.occurringTags,
    shallowEqual
  );

  const events = useSelector(state => state.events.data, shallowEqual);

  let data = [];

  useEffect(() => {
    const onPageTo = key => {
      if (!listRef.current) {
        return;
      }

      let index;

      if (typeof key === "string") {
        if (!data.length) {
          return;
        }

        index = data.findIndex(item => {
          if (item === null) {
            return false;
          }

          return key === item.key;
        });

        if (index < 0) {
          return;
        }

        onPagerBeginDrag();
      } else {
        index = key;
      }

      listRef.current.getNode().scrollTo({
        x: index * Dimensions.get("window").width
      });
    };

    emitter.on("page-lists", onPageTo);

    const onTogglePanel = visible => {
      if (!panelRef.current) {
        return;
      }
      if (visible) {
        panelRef.current.scrollToEnd();
      } else {
        panelRef.current.scrollTo({
          y: 0
        });
      }
    };

    emitter.on("toggle-panel", onTogglePanel);

    return () => {
      emitter.off("page-lists", onPageTo);
      emitter.off("toggle-panel", onTogglePanel);
    };
  }, []);

  if (occurringTags) {
    data = [null, null, null, ...makeData(occurringTags, events)];
  } else {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={panelRef}
        contentInsetAdjustmentBehavior="never"
        pagingEnabled
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}
        onScroll={e => {
          setVerticalOffset(e.nativeEvent.contentOffset.y);
        }}
      >
        <View
          style={{
            height: dimensions.height * 0.7
          }}
        >
          <MarkerMapView />
        </View>
        <View
          style={{
            height: dimensions.height * 0.9
          }}
        >
          <Animated.ScrollView
            ref={listRef}
            contentOffset={{
              x: initialOffset,
              y: 0
            }}
            onScroll={Animated.forkEvent(
              Animated.event([
                { nativeEvent: { contentOffset: { x: scrollOffset.current } } }
              ]),
              e => {
                onPagerScroll(e.nativeEvent.contentOffset.x);
              }
            )}
            scrollEventThrottle={16}
            onScrollBeginDrag={onPagerBeginDrag}
            onMomentumScrollEnd={onPagerScrollEnd}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews
            contentInsetAdjustmentBehavior="never"
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {data.map((item, index) => {
              switch (index) {
                case 0:
                  return <AccountScreen key="account" />;
                case 1:
                  return <SearchList key="search" />;
                case 2:
                  return <UpcomingList key="upnext" />;
                default:
                  return (
                    <TaggedList item={item} key={item.key} index={index} />
                  );
              }
            })}
          </Animated.ScrollView>
          <EventListBar
            data={data}
            ref={footerRef}
            onScroll={onFooterScroll}
            layouts={layouts}
            scrollOffset={scrollOffset}
          />
        </View>
      </ScrollView>
    </View>
  );
});

export default () => (
  <EventListProvider>
    <EventList />
  </EventListProvider>
);

function makeData(occurringTags, data) {
  const keys = _.uniq([
    ...Object.keys(occurringTags.ending),
    ...Object.keys(occurringTags.upcoming),
    ...Object.keys(occurringTags.remaining)
  ]);

  return keys.map(key => {
    let ids = [];

    if (occurringTags.ending[key]) {
      ids = [...ids, ...occurringTags.ending[key]];
    }
    if (occurringTags.upcoming[key]) {
      ids = [...ids, ...occurringTags.upcoming[key]];
    }
    if (occurringTags.remaining[key]) {
      ids = [...ids, ...occurringTags.remaining[key]];
    }

    const ending = occurringTags.ending[key]
      ? occurringTags.ending[key].length
      : 0;

    const upcoming = occurringTags.upcoming[key]
      ? occurringTags.upcoming[key].length
      : 0;

    let item;

    let subtext = "";

    if (ending) {
      const keys = occurringTags.ending[key];
      if (keys) {
        const key = keys[keys.length - 1];
        item = data[key];
        if (item) {
          const { text } = itemRemaining(item);
          subtext = text;
        }
      }
    } else if (upcoming) {
      const upcomingKeys = occurringTags.upcoming[key];
      if (upcomingKeys) {
        const key = upcomingKeys[0];
        item = data[key];
        if (item) {
          const { text } = itemRemaining(item);
          subtext = text.replace(" today", "");
        }
      }
    } else {
      const keys = occurringTags.remaining[key];
      if (keys) {
        const key = keys[0];
        item = data[key];
        if (item) {
          const { remaining } = itemRemaining(item);
          const daysAway = parseInt(remaining.replace("d", ""), 10);
          subtext = `${daysAway} day${daysAway != 1 ? "s" : ""}`;
        }
      }
    }

    return {
      key,
      ids,
      upcoming,
      ending,
      subtext
    };
  });
}

const UpcomingList = () => {
  const data = useSelector(state => state.events.upNext, shallowEqual);
  return <BaseList data={data} index={0} />;
};

const TaggedList = ({ item, index }) => {
  const events = useSelector(state => state.events.data, shallowEqual);
  const data = item.ids.map(id => events[id]);
  return <BaseList data={data} index={index} title={item.key} />;
};

const BaseList = ({ data, index, title }) => {
  const listRef = useRef(null);
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const [dimensions] = useDimensions();
  useEffect(() => {
    const setMarkers = i => {
      if (index === i) {
        dispatch(Events.filterMarkers(data));
      }
    };

    emitter.on("set-markers", setMarkers);

    return () => {
      emitter.off("set-markers", setMarkers);
    };
  }, [data, index]);

  useEffect(() => {
    const onScrollEnabled = scrollEnabled => {
      listRef.current.setNativeProps({ scrollEnabled });
    };

    emitter.on("scroll-enabled", onScrollEnabled);

    return () => {
      emitter.off("scroll-enabled", onScrollEnabled);
    };
  }, []);
  return (
    <View style={{ width: dimensions.width }}>
      <FlatList
        ref={listRef}
        nestedScrollEnabled
        scrollEnabled={false}
        data={data}
        contentContainerStyle={{
          paddingTop: 40 + 12 + 2 + 10,
          paddingBottom: insets.bottom,
          paddingHorizontal: itemMargin / 2
        }}
        removeClippedSubviews
        contentInsetAdjustmentBehavior="never"
        keyExtractor={(item, index) => `${item._id}${index}`}
        renderItem={data => {
          return (
            <UpNextItem
              {...data}
              style={{
                paddingHorizontal: itemMargin / 2,
                width: "100%",
                height: null
              }}
              listTitle={title}
            />
          );
        }}
      />
    </View>
  );
};

function useSynchronizePager(footerRef) {
  const [setPage] = useContext(EventListContext);
  const layouts = useRef({});
  const scrollOffset = useRef(Dimensions.get("window").width);
  const footerOffset = useRef(0);
  const scrollStartOffset = useRef(null);
  const footerStartOffset = useRef(null);

  const onPagerBeginDrag = useCallback(() => {
    scrollStartOffset.current = scrollOffset.current;
    footerStartOffset.current = footerOffset.current;
  }, []);

  const onPagerScroll = useCallback(x => {
    const width = Dimensions.get("window").width;
    scrollOffset.current = x;
    if (x >= 0 && footerStartOffset.current !== null) {
      let progress = x / width;
      let endPage;
      if (scrollStartOffset.current > x) {
        endPage = Math.floor(progress);
        progress = 1 + (endPage - progress);
      } else if (scrollStartOffset.current < x) {
        endPage = Math.ceil(progress);
        progress = 1 - (endPage - progress);
      } else {
        return;
      }

      const layout = layouts.current[endPage];

      if (!layout) {
        return;
      }

      let midX = layout.x + layout.width / 2;

      const halfWidth = width / 2;

      const maxX = layouts.current["container"];

      if (midX < halfWidth) {
        midX = 0;
      } else if (midX > maxX) {
        midX = maxX;
      }

      const distance = midX - halfWidth - footerStartOffset.current;

      footerRef.current.scrollTo({
        x: footerStartOffset.current + distance * progress,
        animated: false
      });
    }
  }, []);

  const onFooterScroll = useCallback(x => {
    footerOffset.current = x;
  }, []);

  const onPagerScrollEnd = useCallback(() => {
    scrollStartOffset.current = null;
    footerStartOffset.current = null;

    let index = Math.round(
      scrollOffset.current / Dimensions.get("window").width
    );
    index = index < 3 ? 0 : index;
    emitter.emit("set-markers", index);
    setPage(index);
  }, []);

  return [
    onPagerBeginDrag,
    onPagerScroll,
    onFooterScroll,
    onPagerScrollEnd,
    layouts
  ];
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
