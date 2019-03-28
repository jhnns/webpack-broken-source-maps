"use strict";

const { SourceNode, SourceMapConsumer } = require("source-map");

const prefix = "// this is some content which will offset the source map by one line\n";

// Either create a SourceNode instance from scratch or based on an input sourceMap
async function createSourceNode(resourcePath, content, sourceMap) {
    if (sourceMap === undefined) {
        const node = new SourceNode(1, 0, resourcePath, content);

        node.setSourceContent(resourcePath, content);

        return node;
    }

    return SourceMapConsumer.with(sourceMap, null, consumer =>
        SourceNode.fromStringWithSourceMap(content, consumer)
    );
}

async function fixedLoader(content, sourceMap) {
    if (!this.sourceMap) {
        // If we don't care about source maps, we can just do whatever we want.
        return prefix + content;
    }

    this.async();

    const node = await createSourceNode(this.resourcePath, content, sourceMap);

    node.prepend(
        // In our case, the generated loader code cannot be mapped to the original source code
        // so let's prepend some code without any mappings to original line and column numbers.
        new SourceNode(
            null, // null = no original line number
            null, // null = no original column number
            null, // null = no original source file
            prefix
        )
    );

    const { code, map: mapGenerator } = node.toStringWithSourceMap();
    // JSON.parse(mapGenerator.toString()) is kind of stupid but that's
    // the way how the source-map module works. Maybe since maps are generated by WASM?
    const map = JSON.parse(mapGenerator.toString());

    this.callback(null, code, map);
}

module.exports = fixedLoader;
