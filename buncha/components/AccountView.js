import React, { useRef, useEffect, useState, useContext } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import * as User from "../store/user";
import store from "../store";
import { IOS } from "../utils/Constants";
import ContactsList from "./ContactsList";
import { LOAD_CONTACTS } from "../utils/Contacts";
import { KeyboardContext, KeyboardProvider } from "./KeyboardContext";

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

export default props => {
  return (
    <KeyboardProvider>
      <AccountView {...props} />
    </KeyboardProvider>
  );
};

const AccountView = ({
  keyboardVerticalOffset,
  keyboardBottomOffset,
  enableDismiss,
  renderHeader
}) => {
  const width = useRef(0);
  const page = useRef(0);
  const transform = useRef(new Animated.Value(0));
  const [keyboardTransformEnabled, setKeyboardTransformEnabled] = useState(
    false
  );

  const [keyboard] = useContext(KeyboardContext);

  const scrollTo = ({ page: p, animated = true, focus = true }) => {
    if (p > 1) {
      emitter.emit(BLUR_ACCOUNT_INPUT);
    }
    page.current = p;
    setKeyboardTransformEnabled(p === 2);
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
          if (p === 3) {
            emitter.emit(LOAD_CONTACTS);
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

  useEffect(() => {
    const {
      user: { number, name, photo, token }
    } = store.getState();

    /** if (name.length && photo) {
      scrollTo({ page: 3, animated: false, focus: false });
    } else */ if (
      token &&
      number
    ) {
      scrollTo({ page: 2, animated: false, focus: false });
    }
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: keyboardTransformEnabled ? keyboard.current : 0 }
          ]
        }
      ]}
      onLayout={e => {
        width.current = e.nativeEvent.layout.width;
        transform.current.setValue(Math.min(0, -width.current * page.current));
      }}
    >
      {renderHeader ? renderHeader() : null}
      <Animated.View
        style={{
          flexDirection: "row",
          flex: 1,
          width: "300%",
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
        <ContactsView
          scrollTo={scrollTo}
          keyboardBottomOffset={keyboardBottomOffset}
        />
      </Animated.View>
    </Animated.View>
  );
};

const NumberView = ({
  scrollTo,
  page,
  keyboardVerticalOffset,
  keyboardBottomOffset,
  enableDismiss
}) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  useControlInput(0, page, ref);
  const value = useSelector(state => state.user.number);
  const disableNext = value.length !== 10;
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
        <Text style={styles.instructText}>Enter your phone number</Text>
        <Input
          ref={ref}
          placeholder="Number"
          keyboardType="numeric"
          value={value}
          onChangeText={text => {
            dispatch({
              type: "user/set",
              payload: {
                number: text
              }
            });
          }}
        />
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
              dispatch(User.getLoginCode());
            }}
            disabled={disableNext}
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
  const dispatch = useDispatch();
  const ref = useRef(null);
  useControlInput(1, page, ref);
  const value = useSelector(state => state.user.loginCode);
  const disableNext = value.length !== 6;
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
        <Input
          ref={ref}
          placeholder="Code"
          keyboardType="numeric"
          value={value}
          textContentType={IOS ? "oneTimeCode" : null}
          onChangeText={text => {
            dispatch({
              type: "user/set",
              payload: {
                loginCode: text
              }
            });
          }}
        />
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
            <Button
              text="Next"
              style={{ flex: 1 }}
              disabled={disableNext}
              onPress={() => {
                scrollTo({ page: 2, focus: false });
                dispatch(User.login());
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const ContactsView = ({ keyboardBottomOffset }) => {
  return (
    <View style={styles.page}>
      <ContactsList bottomOffset={keyboardBottomOffset} />
    </View>
  );
};

export const Button = ({ text, style, disabled, ...props }) => {
  return (
    <View
      style={[
        styles.button,
        style,
        { backgroundColor: disabled ? "#ccc" : BLUE }
      ]}
    >
      <TouchableOpacity
        disabled={disabled}
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
    width: "33.33%",
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
  instructText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8
  },
  button: {
    height: 50,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700"
  }
});
