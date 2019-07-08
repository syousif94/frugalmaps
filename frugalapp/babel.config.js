module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "@babel/transform-runtime",
        {
          regenerator: true
        }
      ]
    ]
  };
};
