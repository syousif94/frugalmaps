import * as SecureStore from "expo-secure-store";
import { AsyncStorage } from "react-native";
import { WEB } from "./Constants";
import store from "../store";
import _ from "lodash";

class User {
  static secureKeys = new Set(["token", "number"]);
  static persistedKeys = new Set(["name", "photo", "needsIntro"]);

  needsIntro = true;

  init = async () => {
    const payload = {};

    if (WEB) {
      for (const key of [...User.secureKeys, ...User.persistedKeys]) {
        let value = localStorage[key];
        if (value) {
          try {
            value = JSON.parse(value);
            this[key] = value;
            payload[key] = value;
          } catch (error) {
            delete localStorage[key];
          }
        }
      }
    } else {
      const promises = [];

      for (const key of User.secureKeys) {
        promises.push(
          SecureStore.getItemAsync(key).then(json => {
            if (json) {
              try {
                const value = JSON.parse(json);
                if (value.length) {
                  this[key] = value;
                  payload[key] = value;
                }
              } catch (error) {
                SecureStore.deleteItemAsync(key);
              }
            }
          })
        );
      }

      for (const key of User.persistedKeys) {
        promises.push(
          AsyncStorage.getItem(key).then(json => {
            if (json) {
              try {
                const value = JSON.parse(json);
                this[key] = value;
                payload[key] = value;
              } catch (error) {
                AsyncStorage.removeItem(key);
              }
            }
          })
        );
      }

      await Promise.all(promises);
    }

    store.dispatch({
      type: "user/set",
      payload
    });
  };
}

export default new User();

export const userPersistor = store => next => action => {
  if (!_.startsWith(action.type, "user/")) {
    return next(action);
  }

  Object.keys(action.payload).forEach(key => {
    const value = action.payload[key];
    const json = JSON.stringify(value);
    if (WEB) {
      if (User.secureKeys.has(key) || User.persistedKeys.has(key)) {
        if (value.length) {
          localStorage[key] = json;
        } else {
          delete localStorage[key];
        }
      }
    } else {
      if (User.secureKeys.has(key)) {
        if (value.length) {
          SecureStore.setItemAsync(key, json);
        } else {
          SecureStore.deleteItemAsync(key);
        }
      } else if (User.persistedKeys.has(key)) {
        if (value.length) {
          AsyncStorage.setItem(key, json);
        } else {
          AsyncStorage.removeItem(key);
        }
      }
    }
  });

  return next(action);
};
