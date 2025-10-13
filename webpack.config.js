// ESM version. If you're not using "type":"module", use module.exports instead.
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "development",
  entry: "./src/main.js",          // <-- your actual entry
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: 'images/[name][ext]' // put under dist/images/
        }
      }
    ],
  },
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "assets"),
    },
    extensions: [".js"],           // lets you import without .js suffix if you want
  },
};
