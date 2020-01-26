import React, { useRef, forwardRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions
} from "react-native";
import BlurView from "./BlurView";
import { useSafeArea } from "react-native-safe-area-context";
import emitter from "tiny-emitter/instance";

export default forwardRef(({ data, layouts, onScroll, scrollOffset }, ref) => {
  const insets = useSafeArea();
  return (
    <BlurView
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0
      }}
    >
      <View
        style={{
          paddingBottom: insets.bottom,
          borderTopWidth: 1,
          borderColor: "rgba(0,0,0,0.05)"
        }}
      >
        <ScrollView
          ref={ref}
          horizontal
          contentContainerStyle={{ paddingTop: 6, paddingHorizontal: 3 }}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={e => {
            onScroll(e.nativeEvent.contentOffset.x);
          }}
        >
          {data.map((item, index) => {
            if (!index) {
              return (
                <FriendsButton
                  index={index}
                  layouts={layouts}
                  key="friends"
                  scrollOffset={scrollOffset}
                />
              );
            } else if (index > 1) {
              return (
                <TagButton
                  index={index}
                  layouts={layouts}
                  key={item.key}
                  item={item}
                  scrollOffset={scrollOffset}
                />
              );
            } else {
              return (
                <AllButton
                  index={index}
                  layouts={layouts}
                  key="upnext"
                  scrollOffset={scrollOffset}
                />
              );
            }
          })}
        </ScrollView>
      </View>
    </BlurView>
  );
});

const Button = ({ layouts, index, children }) => {
  return (
    <View
      style={styles.button}
      onLayout={e => {
        layouts.current[index] = e.nativeEvent.layout;
      }}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => {
          emitter.emit("page-lists", index);
        }}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
};

const FriendsButton = ({ scrollOffset, ...props }) => {
  const [color] = useTitleColor(scrollOffset, props.index);
  return (
    <Button {...props}>
      <Animated.Text style={{ color: color.current }}>Friends</Animated.Text>
    </Button>
  );
};

const AllButton = ({ scrollOffset, ...props }) => {
  const [color] = useTitleColor(scrollOffset, props.index);
  return (
    <Button {...props}>
      <Animated.Text style={{ color: color.current }}>All</Animated.Text>
    </Button>
  );
};

const TagButton = ({ scrollOffset, item, ...props }) => {
  const [color] = useTitleColor(scrollOffset, props.index);
  return (
    <Button {...props}>
      <Animated.Text
        style={[
          styles.titleText,
          {
            color: color.current
          }
        ]}
      >
        {item.key}
      </Animated.Text>
      <Text style={styles.subText}>{item.ids.length}</Text>
    </Button>
  );
};

function useTitleColor(scrollOffset, index) {
  const width = Dimensions.get("window").width;

  const offset = width * index;

  const halfWidth = width * 0.5;

  const start = offset - halfWidth;

  const end = offset + halfWidth;

  const inputRange = [start, offset, end];

  const color = useRef(null);

  color.current = scrollOffset.current.interpolate({
    inputRange,
    outputRange: ["#777", "#000", "#777"],
    extrapolate: "clamp"
  });

  return [color];
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    borderRadius: 5,
    marginHorizontal: 3,
    backgroundColor: "rgba(0,0,0,0.03)"
  },
  touchable: {
    flex: 1,
    paddingHorizontal: 7,
    justifyContent: "center"
  },
  titleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777"
  },
  subText: {
    fontSize: 13,
    color: "#777"
  }
});
