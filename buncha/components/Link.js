import React, { useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { WEB } from "../utils/Constants";

export default ({ to, children, containerStyle = {}, ...props }) => {
  const doClickRef = useRef(false);
  if (WEB) {
    const onClick = e => {
      if (!e.metaKey) {
        e.preventDefault();
        if (doClickRef.current) {
          props.onPress();
        }
      }
      doClickRef.current = false;
    };
    const onPress = e => {
      doClickRef.current = true;
    };
    return (
      <TouchableOpacity onPress={onPress} style={containerStyle}>
        <a
          href={to}
          onClick={onClick}
          draggable={false}
          style={{
            flexDirection: "column",
            flex: 1,
            display: "flex",
            textDecoration: "none",
            padding: 0,
            margin: 0
          }}
        >
          <View style={props.style}>{children}</View>
        </a>
      </TouchableOpacity>
    );
  } else {
    return <TouchableOpacity {...props}>{children}</TouchableOpacity>;
  }
};
