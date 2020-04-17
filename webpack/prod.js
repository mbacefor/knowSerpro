const merge = require("webpack-merge");
const path = require("path");
const base = require("./base");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(base, {
  mode: "production",
  output: {
    filename: "bundle.min.js"
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 9000000,
    maxAssetSize: 9000000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        include: /assets/,
        sourceMap: true,
        terserOptions: {
          output: {
            comments: true
          }
        },chunkFilter: (chunk) => {
          // Exclude uglification for the `vendor` chunk
          if (chunk.name === 'vendor') {
            return false;
          }

          return true;
        },
      })
    ]
  }
});
