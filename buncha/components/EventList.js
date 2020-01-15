import React, { useRef, memo } from "react";
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, shallowEqual } from "react-redux";
import UpNextItem, { itemMargin, columns } from "./UpNextItem";
import { MarkerMapView as MapView } from "../screens/MapScreen";
import { useDimensions } from "../utils/Hooks";
import EventListHeader from "./EventListHeader";

export default memo(() => {
  let initialOffset = 0;
  const scrollOffset = useRef(new Animated.Value(initialOffset));
  const headerRef = useRef(<ListHeader scrollOffset={scrollOffset} />);
  const insets = useSafeArea();
  const data = useSelector(state => state.events.upNext, shallowEqual);
  const [dimensions] = useDimensions();
  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        renderItem={({ item, index }) => {
          return <Text>{item}</Text>;
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffset.current } } }],
          { useNativeDriver: true }
        )}
        contentOffset={{
          x: 0,
          y: 120 + insets.bottom
        }}
        ListHeaderComponent={headerRef.current}
        contentContainerStyle={{
          paddingBottom: insets.bottom,
          paddingHorizontal: itemMargin / 2,
          minHeight: dimensions.height - 40 + 120 + insets.bottom
        }}
        ListHeaderComponentStyle={{ marginHorizontal: itemMargin / -2 }}
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
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
});

const ListHeader = ({ scrollOffset }) => {
  const height = Dimensions.get("window").height - 40;
  return (
    <View
      style={{
        height,
        overflow: "hidden"
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          transform: [
            {
              translateY: scrollOffset.current.interpolate({
                inputRange: [0, height],
                outputRange: [0, height / 2],
                extrapolate: "clamp"
              })
            }
          ]
        }}
      >
        <MapView />
      </Animated.View>
      <View
        style={{
          backgroundColor: "#fff",
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
          marginTop: -25,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6
        }}
      >
        <EventListHeader />
      </View>
    </View>
  );
};

const MenuButton = () => {
  const insets = useSafeArea();
  return (
    <View
      style={{
        position: "absolute",
        bottom: insets.bottom > 0 ? insets.bottom : 15,
        right: 18,
        height: 58,
        width: 58,
        borderRadius: 29,
        backgroundColor: "#157AFC",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.3,
        shadowRadius: 2
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 3
        }}
      >
        <Ionicons name="md-menu" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
