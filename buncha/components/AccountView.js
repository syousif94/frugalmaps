import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  KeyboardAvoidingView
} from "react-native";
import Input from "./Input";
import { BLUE } from "../utils/Colors";
import emitter from "tiny-emitter/instance";

export const FOCUS_ACCOUNT_INPUT = "focus-account-input";
export const BLUR_ACCOUNT_INPUT = "blur-account-input";

function useControlInput(index, page, inputRef) {
  useEffect(() => {
    const onFocus = () => {
      if (index === page.current) {
        inputRef.current.focus();
      }
    };

    emitter.on(FOCUS_ACCOUNT_INPUT, onFocus);

    const onBlur = () => {
      if (index === page.current) {
        inputRef.current.blur();
      }
    };

    emitter.on(BLUR_ACCOUNT_INPUT, onBlur);

    return () => {
      emitter.off(FOCUS_ACCOUNT_INPUT, onFocus);
      emitter.off(BLUR_ACCOUNT_INPUT, onBlur);
    };
  }, [index]);
}

export default ({
  keyboardVerticalOffset,
  keyboardBottomOffset,
  enableDismiss
}) => {
  const width = useRef(0);
  const page = useRef(0);
  const transform = useRef(new Animated.Value(0));

  const scrollTo = ({ page: p, animated = true, focus = true }) => {
    page.current = p;
    requestAnimationFrame(() => {
      const toValue = Math.min(0, page.current * -width.current);
      if (animated) {
        Animated.timing(
          transform.current,
          { toValue, duration: 200 },
          { useNativeDriver: true }
        ).start(() => {
          if (focus) {
            emitter.emit(FOCUS_ACCOUNT_INPUT);
          }
        });
      } else {
        transform.current.setValue(toValue);
        if (focus) {
          emitter.emit(FOCUS_ACCOUNT_INPUT);
        }
      }
    });
  };

  return (
    <View
      style={styles.container}
      onLayout={e => {
        width.current = e.nativeEvent.layout.width;
        transform.current.setValue(Math.min(0, -width.current * page.current));
      }}
    >
      <Animated.View
        style={{
          flexDirection: "row",
          flex: 1,
          width: "400%",
          transform: [
            {
              translateX: transform.current
            }
          ]
        }}
      >
        <NumberView
          scrollTo={scrollTo}
          page={page}
          keyboardVerticalOffset={keyboardVerticalOffset}
          keyboardBottomOffset={keyboardBottomOffset}
          enableDismiss={enableDismiss}
        />
        <CodeView
          scrollTo={scrollTo}
          page={page}
          keyboardVerticalOffset={keyboardVerticalOffset}
          keyboardBottomOffset={keyboardBottomOffset}
          enableDismiss={enableDismiss}
        />
        <ProfileView />
        <ContactsView />
      </Animated.View>
    </View>
  );
};

const NumberView = ({
  scrollTo,
  page,
  keyboardVerticalOffset,
  keyboardBottomOffset,
  enableDismiss
}) => {
  const ref = useRef(null);
  useControlInput(0, page, ref);
  return (
    <View style={styles.page}>
      <TouchableOpacity
        disabled={!enableDismiss}
        onPress={() => {
          emitter.emit(BLUR_ACCOUNT_INPUT);
        }}
        style={{ ...StyleSheet.absoluteFillObject }}
      />
      <View style={styles.pageContent} pointerEvents="box-none">
        <Input ref={ref} placeholder="Number" keyboardType="numeric" />
        <KeyboardAvoidingView
          pointerEvents="box-none"
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={{
            position: "absolute",
            bottom: keyboardBottomOffset,
            right: 30,
            left: 30,
            top: 0,
            justifyContent: "flex-end"
          }}
        >
          <Button
            text="Next"
            onPress={() => {
              scrollTo({ page: 1 });
            }}
          />
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const CodeView = ({
  scrollTo,
  page,
  keyboardVerticalOffset,
  keyboardBottomOffset,
  enableDismiss
}) => {
  const ref = useRef(null);
  useControlInput(1, page, ref);
  return (
    <View style={styles.page}>
      <TouchableOpacity
        disabled={!enableDismiss}
        onPress={() => {
          emitter.emit(BLUR_ACCOUNT_INPUT);
        }}
        style={{ ...StyleSheet.absoluteFillObject }}
      />
      <View style={styles.pageContent} pointerEvents="box-none">
        <Input ref={ref} placeholder="Code" keyboardType="numeric" />
        <KeyboardAvoidingView
          pointerEvents="box-none"
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={{
            position: "absolute",
            bottom: keyboardBottomOffset,
            right: 30,
            left: 30,
            top: 0,
            justifyContent: "flex-end"
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Button
              text="Previous"
              onPress={() => {
                scrollTo({ page: 0 });
              }}
              style={{ flex: 1 }}
            />
            <View style={{ width: 15 }} />
            <Button text="Next" style={{ flex: 1 }} />
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const ProfileView = () => {
  return <View style={styles.page} />;
};

const ContactsView = () => {
  return <View style={styles.page} />;
};

const Button = ({ text, style, ...props }) => {
  return (
    <View style={[styles.button, style]}>
      <TouchableOpacity
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        {...props}
      >
        <Text allowFontScaling={false} style={styles.buttonText}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    overflow: "hidden"
  },
  page: {
    width: "25%",
    overflow: "hidden"
  },
  pageContent: {
    justifyContent: "flex-start",
    flex: 1,
    alignSelf: "center",
    paddingHorizontal: 30,
    maxWidth: 500,
    width: "100%"
  },
  button: {
    height: 50,
    backgroundColor: BLUE,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700"
  }
});
