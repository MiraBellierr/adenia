import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginReactNativeConfig from "eslint-plugin-react-native";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReactConfig,
  pluginReactNativeConfig.configs.all,
];
