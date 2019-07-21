import { combineReducers } from "redux";
import { grantLocation } from "../utils/Permissions";
import { makeState } from "./reducers";

const makeReducer = makeState("permissions");
const location = makeReducer("location", null);

export default combineReducers({
  location
});

export function enableLocation() {
  return async dispatch => {
    try {
      await grantLocation();
      dispatch({
        type: "permissions/set",
        payload: {
          location: true
        }
      });
    } catch (error) {
      dispatch({
        type: "permissions/set",
        payload: {
          location: false
        }
      });
    }
  };
}
