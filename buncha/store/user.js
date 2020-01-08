import { combineReducers } from "redux";
import { makeState } from "./reducers";
import api from "../utils/API";
const makeReducer = makeState("user");

const needsIntro = makeReducer("needsIntro", true);
const loading = makeReducer("loading", false);
const loginCode = makeReducer("loginCode", "");
const token = makeReducer("token", null);
const name = makeReducer("name", "");
const number = makeReducer("number", "");
const photo = makeReducer("photo", null);
const localPhoto = makeReducer("localPhoto", null);
const showContacts = makeReducer("showContacts", false);

export default combineReducers({
  loading,
  loginCode,
  needsIntro,
  token,
  name,
  number,
  photo,
  localPhoto,
  showContacts
});

export function getLoginCode() {
  return async (dispatch, getState) => {
    const {
      user: { number }
    } = getState();

    dispatch({
      type: "user/set",
      payload: {
        loginCode: ""
      }
    });

    if (number && number.length === 10) {
      try {
        await api("user/login", { number });
      } catch (error) {
        console.log(error.message);
      }
    }
  };
}

export function login() {
  return async (dispatch, getState) => {
    const {
      user: { loginCode, number }
    } = getState();

    const validNumber = number && number.length === 10;
    const validCode = loginCode && loginCode.length === 6;

    if (validNumber && validCode) {
      try {
        dispatch({
          type: "user/set",
          payload: {
            loading: true
          }
        });
        const res = await api("user/token", { number, code: loginCode });

        let photo;
        let name;
        if (res.user) {
          photo = res.user._source.photo || null;
          name = res.user._source.name || "";
        }

        dispatch({
          type: "user/set",
          payload: {
            token: res.token,
            name,
            photo,
            loading: false
          }
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  };
}

export function saveProfile() {
  return async (dispatch, getState) => {
    const {
      user: { name, number }
    } = getState();
    try {
      await api("user/account", { name, number });
    } catch (error) {
      console.log(error);
    }
  };
}

export function logout() {
  return {
    type: "user/set",
    payload: {
      showContacts: false,
      token: null,
      number: "",
      name: "",
      photo: null
    }
  };
}

export function uploadPhoto(uri) {
  return async dispatch => {
    dispatch({
      type: "user/set",
      payload: {
        localPhoto: uri,
        photo: null
      }
    });

    try {
      const { key, policy, signature } = await api("user/photo/policy");

      console.log({
        key,
        policy,
        signature
      });

      const file = {
        uri,
        type: "image/jpeg",
        name: `${key}.jpg`
      };

      const fd = new FormData();
      fd.append("key", `profile/${key}.jpg`);
      fd.append("AWSAccessKeyId", "AKIAIY7YU2RN7KWKOL7Q");
      fd.append("acl", "private");
      fd.append("policy", policy);
      fd.append("signature", signature);
      fd.append("Content-Type", "image/jpeg");
      fd.append("file", file);

      const text = await fetch("https://buncha.s3.amazonaws.com", {
        method: "POST",
        body: fd
      }).then(res => res.text());

      if (text.length) {
        throw new Error("Photo upload failed...");
      }

      await api("user/photo/update", { key });

      dispatch({
        type: "user/set",
        payload: {
          photo: key
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
}
