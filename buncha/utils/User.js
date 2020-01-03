import * as SecureStore from "expo-secure-store";
import { AsyncStorage } from "react-native";
import { WEB } from "./Constants";
import store from "../store";

class User {
  token = null;
  needsIntro = false;

  init = async () => {
    if (WEB) {
      this.token = localStorage["token"] || null;
      this.needsIntro = !localStorage["intro"];
    } else {
      this.token = await SecureStore.getItemAsync("token");
      const intro = await AsyncStorage.getItem("intro");
      this.needsIntro = !intro;
    }
    store.dispatch({
      type: "user/set",
      payload: {
        token: this.token,
        needsIntro: this.needsIntro
      }
    });
  };
}

export default new User();
