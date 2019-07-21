import { Linking } from "expo";

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
