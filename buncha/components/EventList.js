import React, { useRef, memo, useEffect, useCallback } from "react";
import { View, StyleSheet, Animated, FlatList, Dimensions } from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import { useSelector, shallowEqual } from "react-redux";
import UpNextItem, { itemMargin, columns } from "./UpNextItem";
import { useDimensions } from "../utils/Hooks";
import _ from "lodash";
import EventListFooter from "./EventListFooter";
import AccountScreen from "../screens/AccountScreen";
import emitter from "tiny-emitter/instance";
import { itemRemaining } from "../utils/Time";

export const EXPOSED_LIST = 200;

export default memo(() => {
  const listRef = useRef(null);
  const footerRef = useRef(null);
  const [dimensions] = useDimensions();
  const initialOffset = dimensions.width;
  const scrollOffset = useRef(new Animated.Value(initialOffset));
  const [
    onPagerBeginDrag,
    onPagerScroll,
    onFooterScroll,
    onPagerScrollEnd,
    layouts
  ] = useSynchronizePager(footerRef);

  useEffect(() => {
    const onPageTo = index => {
      if (listRef.current) {
        listRef.current.getNode().scrollTo({
          x: index * dimensions.width
        });
      }
    };

    emitter.on("page-lists", onPageTo);

    return () => {
      emitter.off("page-lists", onPageTo);
    };
  }, []);

  const occurringTags = useSelector(
    state => state.events.occurringTags,
    shallowEqual
  );

  const events = useSelector(state => state.events.data, shallowEqual);

  let data = [];

  if (occurringTags) {
    data = [null, null, ...makeData(occurringTags, events)];
  } else {
    return null;
  }

  return (
    <View style={styles.container}>
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
      >
        {data.map((item, index) => {
          switch (index) {
            case 0:
              return <AccountScreen key="account" />;
            case 1:
              return <UpcomingList key="upnext" />;
            default:
              return <TaggedList item={item} key={item.key} />;
          }
        })}
      </Animated.ScrollView>
      <EventListFooter
        data={data}
        ref={footerRef}
        onScroll={onFooterScroll}
        layouts={layouts}
        scrollOffset={scrollOffset}
      />
    </View>
  );
});

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
  return <BaseList data={data} />;
};

const TaggedList = ({ item }) => {
  const events = useSelector(state => state.events.data, shallowEqual);
  const data = item.ids.map(id => events[id]);
  return <BaseList data={data} />;
};

const BaseList = ({ data }) => {
  const insets = useSafeArea();
  const [dimensions] = useDimensions();
  return (
    <View style={{ width: dimensions.width }}>
      <FlatList
        data={data}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingHorizontal: itemMargin / 2
        }}
        removeClippedSubviews
        contentInsetAdjustmentBehavior="never"
        keyExtractor={item => item._id}
        numColumns={columns}
        columnWrapperStyle={{
          width: dimensions.width > 500 ? "25%" : "50%"
        }}
        renderItem={data => {
          return (
            <UpNextItem
              {...data}
              style={{
                paddingHorizontal: itemMargin / 2
              }}
            />
          );
        }}
      />
    </View>
  );
};

function useSynchronizePager(footerRef) {
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

      let midX = layout.x + layout.width / 2;

      const halfWidth = width / 2;

      if (midX < halfWidth) {
        midX = 0;
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
