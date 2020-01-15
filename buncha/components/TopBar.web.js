import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import PickerButton, { buttonHeight } from "./PickerButton";
import { navigate } from "../screens";
import { Ionicons } from "@expo/vector-icons";
import { BLUE } from "../utils/Colors";
import EventSearchInput from "./EventSearchInput";

export default ({ style = {}, contentContainerStyle = {}, width }) => {
  const containerStyle = {
    backgroundColor: "rgba(240,240,240,0.9)",
    WebkitBackdropFilter: "blur(30px)",
    backdropFilter: "blur(30px)",
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 48,
    borderBottom: "0.5px solid rgba(0,0,0,0.08)",
    ...StyleSheet.flatten(style)
  };

  const contentStyle = {
    flexDirection: "row",
    width: "100%",
    flex: 1,
    alignSelf: "center",
    maxWidth: 900,
    minHeight: "100%",
    alignItems: "center",
    ...StyleSheet.flatten(contentContainerStyle)
  };

  const narrow = width < 500;

  return (
    <div style={containerStyle}>
      <View style={contentStyle}>
        <EventSearchInput
          contentContainerStyle={{
            flex: 1,
            marginHorizontal: 2.5,
            flexDirection: "row",
            alignItems: "center"
          }}
        />
        <PickerButton />
        <MenuButton />
      </View>
    </div>
  );
};

const MenuButton = ({ narrow }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <div
      onMouseLeave={() => {
        setMenuVisible(false);
      }}
    >
      <div
        onMouseEnter={e => {
          setMenuVisible(true);
        }}
      >
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setMenuVisible(!setMenuVisible);
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
          padding: 10,
          opacity: menuVisible ? 1 : 0
        }}
        pointerEvents={menuVisible ? "auto" : "none"}
      >
        <div
          style={{
            marginTop: 2.5,
            marginRight: 10,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            backgroundColor: "rgba(240,240,240,0.9)",
            WebkitBackdropFilter: "blur(30px)",
            backdropFilter: "blur(30px)",
            border: "0.5px solid rgba(0,0,0,0.1)",
            borderTop: "none",
            display: "flex"
          }}
        >
          <View style={{ padding: 2.5, width: 230 }}>
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
    borderRadius: 6,
    backgroundColor: "rgba(180,180,180,0.1)",
    marginHorizontal: 2.5
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
    margin: 2.5,
    borderRadius: 3
  },
  menuButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: BLUE
  }
});
