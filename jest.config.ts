import path from "path";

module.exports = {
  moduleNameMapper: {
    "^react$": "preact/compat",
    "^react-dom$": "preact/compat",
  },
  moduleDirectories: ["node_modules", path.resolve(__dirname, "src")],
};
