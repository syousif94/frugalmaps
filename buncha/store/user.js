import { combineReducers } from "redux";
import { makeState } from "./reducers";
import api from "../utils/API";
const makeReducer = makeState("user");

const needsIntro = makeReducer("needsIntro", false);
const token = makeReducer("token", null);
const name = makeReducer("name", "");
const number = makeReducer("number", "");
const photo = makeReducer("photo", null);
const contacts = makeReducer("contacts", []);

export default combineReducers({
  needsIntro,
  token,
  name,
  number,
  photo,
  contacts
});

export function getLoginCode() {
  return async (dispatch, getState) => {
    const {
      user: { number }
    } = getState();

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
  return async (dispatch, getState) => {};
}
