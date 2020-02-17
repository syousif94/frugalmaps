import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet
} from "react-native";
import { useDimensions } from "../utils/Hooks";
import MapView from "./MapView";
import { useSelector, shallowEqual } from "react-redux";
import EventListItem from "./EventListItem";
import BlurView from "./BlurView";
import EventSearchInput from "./EventSearchInput";
import TagList from "./TagList";
import { Ionicons } from "@expo/vector-icons";
import { BLUE } from "../utils/Colors";
import { navigate } from "../screens";
import PickerButton, { buttonHeight } from "./PickerButton";

export default () => {
  const [dimensions] = useDimensions();

  const Header = useRef(<HeaderView />);
  const Map = useRef(<MapView />);

  const data = useSelector(state => state.events.upNext, shallowEqual);

  if (dimensions.width > 850) {
    const itemWidth = (400 - 14) / 3;
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        {Map.current}
        <View style={{ width: 400 }}>
          <ScrollView>
            {Header.current}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                padding: 7
              }}
            >
              {data.map((item, index) => {
                return (
                  <EventListItem
                    item={item}
                    index={index}
                    width={itemWidth}
                    key={item._id}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  const perRow = dimensions.width < 550 ? 3 : 4;
  const itemWidth = (dimensions.width - 14) / perRow;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ height: dimensions.height - 44, zIndex: 999 }}>
          {Map.current}
          {Header.current}
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            padding: 7
          }}
        >
          {data.map((item, index) => {
            return (
              <EventListItem
                item={item}
                index={index}
                width={itemWidth}
                key={item._id}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export const HeaderView = () => {
  const [dimensions] = useDimensions();
  const style =
    dimensions.width > 850
      ? null
      : {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0
        };
  return (
    <View style={[style, , { zIndex: 999 }]}>
      <BlurView>
        <View
          style={{
            borderColor: "rgba(0,0,0,0.05)",
            borderTopWidth: 1,
            borderBottomWidth: 1
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 2,
              marginLeft: 2,
              zIndex: 999
            }}
          >
            <EventSearchInput contentContainerStyle={{ flex: 1 }} />
            <PickerButton />
            <MenuButton />
          </View>

          <TagList />
        </View>
      </BlurView>
    </View>
  );
};

const MenuButton = () => {
  const clickedRef = useRef(false);
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <div
      style={{
        zIndex: 999
      }}
      onMouseLeave={() => {
        if (clickedRef.current) {
          return;
        }
        setMenuVisible(false);
      }}
    >
      <div
        onMouseEnter={e => {
          if (clickedRef.current) {
            return;
          }
          setMenuVisible(true);
        }}
      >
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            const visible = !clickedRef.current;
            clickedRef.current = visible;
            setMenuVisible(visible);
          }}
        >
          <Ionicons
            name="md-menu"
            size={18}
            color={menuVisible ? "#999" : BLUE}
          />
        </TouchableOpacity>
      </div>
      <View
        style={{
          position: "absolute",
          top: buttonHeight,
          right: 0,
          opacity: menuVisible ? 1 : 0
        }}
        pointerEvents={menuVisible ? "auto" : "none"}
      >
        <div
          style={{
            borderRadius: 5,
            backgroundColor: "rgba(240,240,240,0.9",
            WebkitBackdropFilter: "blur(30px)",
            backdropFilter: "blur(30px)",
            display: "flex"
          }}
        >
          <View style={{ padding: 1, width: 160 }}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                navigate("Add");
              }}
            >
              <Text style={styles.menuButtonText}>Add Stuff</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuButtonText}>Create Invite</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </div>
      </View>
    </div>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: buttonHeight,
    minWidth: buttonHeight,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginHorizontal: 2,
    backgroundColor: "rgba(180,180,180,0.1)"
  },
  buttonText: {
    marginLeft: 7,
    fontSize: 12,
    fontWeight: "500",
    color: BLUE
  },
  menuHeaderText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "700"
  },
  menuButton: {
    padding: 7,
    backgroundColor: "rgba(0,0,0,0.03)",
    margin: 1,
    borderRadius: 2
  },
  menuButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: BLUE
  }
});
