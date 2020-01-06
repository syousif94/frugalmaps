import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image
} from "react-native";
import Input from "./Input";
import { BLUE } from "../utils/Colors";
import emitter from "tiny-emitter/instance";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as User from "../store/user";
import store from "../store";
import * as ImagePicker from "expo-image-picker";

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

  useEffect(() => {
    const {
      user: { number, name, photo, token }
    } = store.getState();

    if (name.length && photo) {
      scrollTo({ page: 3, animated: false, focus: false });
    } else if (token && number) {
      scrollTo({ page: 2, animated: false, focus: false });
    }
  }, []);

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
        <ProfileView keyboardBottomOffset={keyboardBottomOffset} />
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

const ProfileView = ({ keyboardBottomOffset }) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.user.loading);
  const photo = useSelector(state => {
    if (state.user.photo) {
      return { uri: state.user.photo };
    } else if (state.user.localPhoto) {
      return { uri: state.user.localPhoto };
    }
    return null;
  }, shallowEqual);
  const name = useSelector(state => state.user.name);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.pageContent}>
        <TouchableOpacity
          style={{ alignSelf: "center", marginBottom: 30 }}
          onPress={async () => {
            try {
              const {
                canceled,
                uri
              } = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.4
              });

              if (!canceled) {
                dispatch({
                  type: "user/set",
                  payload: {
                    localPhoto: uri
                  }
                });
              }
            } catch (error) {
              console.log(error);
            }
          }}
        >
          {photo ? (
            <Image
              source={photo}
              style={{
                height: 250,
                width: 250,
                borderRadius: 125,
                backgroundColor: "#ccc"
              }}
            />
          ) : (
            <View
              style={{
                height: 250,
                width: 250,
                borderRadius: 125,
                backgroundColor: "#ccc"
              }}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.instructText}>What do you go by?</Text>
        <Input
          autoCapitalize="words"
          placeholder="Name"
          value={name}
          onChangeText={text => {
            dispatch({
              type: "user/set",
              payload: {
                name: text
              }
            });
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: keyboardBottomOffset,
            left: 30,
            right: 30
          }}
        >
          <Text style={styles.instructText}>Last step!</Text>
          <Button text="Pick Friends" />
          <TouchableOpacity>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const ContactsView = () => {
  return (
    <View style={styles.page}>
      <View style={styles.pageContent}>
        <Text>Contacts</Text>
      </View>
    </View>
  );
};

const Button = ({ text, style, disabled, ...props }) => {
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
