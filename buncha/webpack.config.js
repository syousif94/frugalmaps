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

  return config;
};
