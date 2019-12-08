const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const fs = require("fs");

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(
    { ...env, removeUnusedImportExports: false },
    argv
  );

  if (config.mode === "development") {
    config.devServer.https = true;
    config.devServer.disableHostCheck = true;
    config.devServer.historyApiFallback = true;
  }

  if (config["plugins"]) {
    config["plugins"].forEach(plugin => {
      // detect workbox plugin
      if (
        plugin["config"] &&
        plugin["config"]["swDest"] === "service-worker.js"
      ) {
        // tell it never to cache index.html or service-worker.js
        plugin["config"]["exclude"].push(/index.html/);
        plugin["config"]["exclude"].push(/service-worker.js/);

        // (optional) tell it to start new service worker versions immediately, even if tabs
        // are still running the old one.
        plugin["config"]["skipWaiting"] = true;
      }
    });
  }

  return config;
};
