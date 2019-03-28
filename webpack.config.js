"use strict";

module.exports = {
    mode: "development",
    entry: [
        require.resolve("./fixedLoader.js"),
        // require.resolve("./brokenLoader.js"),
        "babel-loader", // we use the babel-loader to test the scenario where a previous loader already generated source maps
        require.resolve("./src/main.js")
    ].join("!"),
    devtool: "source-map"
};