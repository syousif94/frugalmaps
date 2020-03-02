import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BLUE } from "../utils/Colors";
import { navigate } from "../screens";
import { buttonHeight } from "./PickerButton";

export default () => {
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
          top: buttonHeight + 3,
          right: 0,
          opacity: menuVisible ? 1 : 0
        }}
        pointerEvents={menuVisible ? "auto" : "none"}
      >
        <div
          style={{
            borderRadius: 3,
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
    marginHorizontal: 5,
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
