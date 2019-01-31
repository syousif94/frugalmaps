import { Linking } from "expo";
import store from "./store";
import * as Events from "./store/events";

function handleLink(navigator) {
  return ({ url }) => {
    if (!url) {
      return;
    }
    const { path } = Linking.parse(url);
    const selectedId = path.split("e/")[1];
    if (!selectedId) {
      return;
    }
    store.dispatch(
      Events.actions.set({
        selectedId
      })
    );
    navigator._navigation.navigate("Info");
  };
}

export async function watchLinking(navigator) {
  const handler = handleLink(navigator);
  const url = await Linking.getInitialURL();
  if (url) {
    handler({ url });
  }
  Linking.addEventListener("url", handler);
}
