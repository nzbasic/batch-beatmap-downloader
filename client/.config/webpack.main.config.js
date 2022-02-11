/* eslint @typescript-eslint/no-var-requires: "off" */
const plugins = require("./webpack.main.plugins");

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/main.ts",
  // Put your normal webpack config below here

  module: {
    rules: require("./webpack.rules"),
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },

  plugins: plugins,
};
