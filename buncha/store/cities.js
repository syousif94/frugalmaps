import { combineReducers } from "redux";
import api from "../utils/API";
import { makeState } from "./reducers";
import locate from "../utils/Locate";

const makeReducer = makeState("cities");
const closest = makeReducer("closest", []);
const popular = makeReducer("popular", []);
const list = makeReducer("list", "closest");

export default combineReducers({
  closest,
  popular,
  list
});

export function selectList(key) {
  return {
    type: "cities/set",
    payload: {
      list: key
    }
  };
}

export function get() {
  return async (dispatch, getState) => {
    try {
      let request;

      const {
        permissions: { location: locationEnabled }
      } = getState();

      if (locationEnabled) {
        const {
          coords: { latitude: lat, longitude: lng }
        } = await locate();

        request = api("places/popular", { lat, lng });
      } else {
        request = api("places/popular");
      }

      const res = await request;

      let popular = [];
      let closest = [];

      if (res.nearby && res.nearby.length) {
        closest = res.nearby.filter(val => val && val._source.name);
      }

      if (res.popular && res.popular.length) {
        popular = res.popular
          .filter(val => val && val._source.name)
          .sort((a, b) => b._source.count - a._source.count);
      }

      dispatch({
        type: "cities/set",
        payload: {
          popular,
          closest
        }
      });
    } catch (error) {}
  };
}
