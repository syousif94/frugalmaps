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
const contacts = makeReducer("contacts", []);

export default combineReducers({
  loading,
  loginCode,
  needsIntro,
  token,
  name,
  number,
  photo,
  contacts,
  localPhoto
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

        console.log({ res });

        let photo;
        let name;
        if (res.user) {
          photo = res.user._source.photo;
          name = res.user._source.name;
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

export function logout() {
  return {
    type: "user/set",
    payload: {
      token: null,
      number: "",
      name: "",
      photo: null
    }
  };
}
