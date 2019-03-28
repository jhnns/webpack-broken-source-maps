"use strict";

function brokenLoader(content, sourceMap) {
    // Don't do this since it makes the sourceMap information useless :(
    const newContent = "// this is some content which will offset the source map by one line\n" + content;
    this.callback(null, newContent, sourceMap);
}

module.exports = brokenLoader;