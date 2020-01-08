import React, { useRef, useContext } from "react";
import { Button } from "./AccountView";
import UserPhoto from "./UserPhoto";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Dimensions
} from "react-native";
import Input from "./Input";
import { useSelector, useDispatch } from "react-redux";
import * as User from "../store/user";
import { IOS } from "../utils/Constants";
import { KeyboardContext } from "./KeyboardContext";
import emitter from "tiny-emitter/instance";

export default ({ scrollTo }) => {
  const [_, setBottomOffset] = useContext(KeyboardContext);
  const bottomOffsetCalculator = useRef(
    new BottomOffsetCalculator(setBottomOffset)
  );
  const dispatch = useDispatch();
  const loading = useSelector(state => state.user.loading);

  const disableNext = useSelector(
    state => !state.user.name.length || !state.user.photo
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View
      style={{ width: "33.33%" }}
      onLayout={e => {
        const layout = e.nativeEvent.layout;
        bottomOffsetCalculator.current.setContentLayout(layout);
      }}
    >
      <View
        style={{
          justifyContent: "flex-start",
          flex: 1,
          alignSelf: "center",
          paddingHorizontal: 30,
          maxWidth: 500,
          width: "100%"
        }}
      >
        <UserPhoto />
        <Text style={{ fontSize: 14, color: "#555", marginBottom: 8 }}>
          What do you go by?
        </Text>
        <NameInput
          onLayout={e => {
            const layout = e.nativeEvent.layout;
            bottomOffsetCalculator.current.setInputLayout(layout);
          }}
        />
        <Text
          style={{
            fontSize: 14,
            color: "#555",
            marginBottom: 8,
            marginTop: 25
          }}
        >
          Last step!
        </Text>
        <Button
          text="Pick Friends"
          disabled={disableNext}
          onPress={() => {
            dispatch(User.saveProfile());
            dispatch({
              type: "user/set",
              payload: {
                showContacts: true
              }
            });
            emitter.emit("scroll-intro-contacts");
          }}
        />
      </View>
    </View>
  );
};

class BottomOffsetCalculator {
  contentLayout;
  inputLayout;

  constructor(setBottomOffset) {
    this.setBottomOffset = setBottomOffset;
  }

  setContentLayout = layout => {
    this.contentLayout = layout;
    this.calculateBottomOffset();
  };

  setInputLayout = layout => {
    this.inputLayout = layout;
    this.calculateBottomOffset();
  };

  calculateBottomOffset = () => {
    if (!this.contentLayout || !this.inputLayout || !this.setBottomOffset) {
      return;
    }

    const windowHeight = Dimensions.get("window").height;

    const contentOffset =
      windowHeight -
      this.contentLayout.height +
      this.inputLayout.y +
      this.inputLayout.height;

    const bottomOffset = contentOffset - windowHeight + 25;

    this.setBottomOffset(bottomOffset);
  };
}

const NameInput = ({ onLayout }) => {
  const dispatch = useDispatch();
  const name = useSelector(state => state.user.name);
  return (
    <View onLayout={onLayout}>
      <Input
        autoCapitalize="words"
        placeholder="Name"
        value={name}
        textContentType={IOS ? "name" : null}
        onChangeText={text => {
          dispatch({
            type: "user/set",
            payload: {
              name: text
            }
          });
        }}
      />
    </View>
  );
};

export const LogoutButton = ({ scrollTo }) => {
  const loggedIn = useSelector(state => state.user.token);
  const dispatch = useDispatch();
  if (!loggedIn) {
    return null;
  }
  return (
    <TouchableOpacity
      style={{ padding: 5, paddingRight: 0 }}
      onPress={logout.bind(null, { dispatch, scrollTo })}
    >
      <Text
        style={{
          fontSize: 14,
          color: "#4E08DB",
          fontWeight: "700"
        }}
      >
        Logout
      </Text>
    </TouchableOpacity>
  );
};

function logout({ dispatch, scrollTo }) {
  Alert.alert("Logout", "Are you sure?", [
    {
      text: "Cancel",
      style: "cancel"
    },
    {
      text: "OK",
      onPress: () => {
        dispatch(User.logout());
        scrollTo({ page: 0 });
      }
    }
  ]);
}

const LoadingScreen = ({ keyboardBottomOffset = 0 }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: keyboardBottomOffset
      }}
    >
      <ActivityIndicator size="large" color="#999" />
    </View>
  );
};
