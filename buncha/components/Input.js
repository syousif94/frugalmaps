import React, { memo, useState, useRef, useEffect } from "react";
import {
  TouchableOpacity,
  TextInput,
  View,
  StyleSheet,
  Keyboard
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WEB, ANDROID, IOS } from "../utils/Constants";
import { BLUE, RED } from "../utils/Colors";

export default memo(
  React.forwardRef(
    (
      {
        style = {},
        render,
        onChangeText,
        autoCompleteType,
        containerStyle = {},
        backgroundColor = "#f4f4f4",
        returnKeyType = null,
        name,
        multiline,
        blurOnSubmit,
        autoCorrect,
        spellCheck,
        invalid = false,
        ...props
      },
      ref
    ) => {
      const [focused, setFocused] = useState(false);
      const inputRef = ref || useRef(null);
      const pointerEvents = focused ? "auto" : "none";

      useEffect(() => {
        if (ANDROID) {
          const onHide = () => {
            if (focused) {
              inputRef.current.blur();
            }
          };
          if (focused) {
            Keyboard.addListener("keyboardDidHide", onHide);
          } else {
            Keyboard.removeListener("keyboardDidHide", onHide);
          }

          return () => {
            Keyboard.removeListener("keyboardDidHide", onHide);
          };
        }
      }, [focused]);

      const _focus = () => {
        inputRef.current.focus();
        setFocused(true);
        if (!ref && props.onFocus) {
          props.onFocus();
        }
      };

      const _onFocus = () => {
        if (!ref && IOS) {
          return;
        }
        setFocused(true);
        if (props.onFocus) {
          props.onFocus();
        }
      };

      const _onBlur = () => {
        setFocused(false);
        if (props.onBlur) {
          props.onBlur();
        }
      };

      const _clear = () => {
        requestAnimationFrame(() => {
          onChangeText("");
        });
      };

      const _renderClear = multiline => {
        if (!props.value || !props.value.length) return null;

        const style = [styles.clear];
        if (multiline) {
          style.push({
            height: 40
          });
        } else {
          style.push({
            bottom: 0
          });
        }

        return (
          <TouchableOpacity style={style} onPress={_clear}>
            <Ionicons
              name="ios-close-circle"
              size={18}
              color="rgba(0,0,0,0.4)"
            />
          </TouchableOpacity>
        );
      };

      const _onChange = e => {
        onChangeText(e.target.value);
      };

      const _onKeyPress = e => {
        const keycode = e.keyCode ? e.keyCode : e.which;
        if (blurOnSubmit && keycode === 13) {
          inputRef.current.blur();
        }
      };

      const container = [
        styles.inputContainer,
        containerStyle,
        {
          backgroundColor: focused ? "#fff" : backgroundColor,
          borderWidth: 1,
          borderColor: invalid ? RED : focused ? BLUE : "rgba(0,0,0,0)"
        }
      ];

      if (WEB) {
        const correct = autoCorrect === false ? "off" : null;
        const checkSpelling = spellCheck === false ? "false" : null;
        return (
          <View style={container}>
            {render ? (
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => {
                  requestAnimationFrame(() => {
                    inputRef.current.focus();
                  });
                }}
              >
                {render()}
              </TouchableOpacity>
            ) : null}
            {multiline ? (
              <textarea
                ref={inputRef}
                {...props}
                name={name}
                style={{
                  resize: "none",
                  border: "none",
                  ...StyleSheet.flatten(styles.input),
                  outline: "none",
                  textDecoration: "none",
                  appearance: "none",
                  background: "transparent",
                  fontSize: 14,
                  height: 100,
                  ...StyleSheet.flatten(style),
                  paddingTop: 12,
                  paddingRight: 10,
                  fontFamily:
                    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif'
                }}
                onFocus={_onFocus}
                onBlur={_onBlur}
                onChange={_onChange}
                onKeyPress={_onKeyPress}
                autoCorrect={correct}
                spellCheck={checkSpelling}
              ></textarea>
            ) : (
              <input
                ref={inputRef}
                {...props}
                name={name}
                style={{
                  border: "none",
                  ...StyleSheet.flatten(styles.input),
                  outline: "none",
                  textDecoration: "none",
                  appearance: "none",
                  background: "transparent",
                  fontSize: 14,
                  ...StyleSheet.flatten(style),
                  fontFamily:
                    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif'
                }}
                onFocus={_onFocus}
                onBlur={_onBlur}
                onChange={_onChange}
                onKeyPress={_onKeyPress}
                autoCorrect={correct}
                spellCheck={checkSpelling}
              />
            )}

            {_renderClear(multiline)}
          </View>
        );
      }

      const inputStyle = [styles.input];

      if (multiline) {
        inputStyle.push({
          height: 100,
          paddingTop: 12,
          paddingRight: 10,
          textAlignVertical: "top"
        });
      }
      if (style) {
        inputStyle.push(style);
      }

      return (
        <View style={container}>
          <TouchableOpacity
            style={styles.btn}
            onPress={_focus}
            disabled={focused}
            activeOpacity={1}
          >
            {render ? render() : null}
            <TextInput
              allowFontScaling={false}
              pointerEvents={pointerEvents}
              ref={inputRef}
              {...props}
              returnKeyType={returnKeyType}
              onChangeText={onChangeText || null}
              style={inputStyle}
              onFocus={_onFocus}
              onBlur={_onBlur}
              placeholderTextColor="rgba(0,0,0,0.5)"
              autoCompleteType={autoCompleteType}
              multiline={multiline}
              blurOnSubmit={blurOnSubmit}
              autoCorrect={autoCorrect}
            />
          </TouchableOpacity>
          {_renderClear(multiline)}
        </View>
      );
    }
  )
);

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: "row"
  },
  input: {
    height: 44,
    padding: 0,
    margin: 0,
    paddingLeft: 10,
    flex: 1,
    fontSize: 16
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
    overflow: "hidden"
  },
  clear: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center"
  }
});
