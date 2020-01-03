import { combineReducers } from "redux";
import { makeState } from "./reducers";
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
