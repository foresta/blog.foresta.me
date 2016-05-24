module.exports = {
    entry: "./src/entry.js",
    output: {
        path: "./static/javascripts",
        filename: "index.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015"]   
                }
            },
            { test: /\.css$/, loader: "style!css" },
            { test: /\.scss$/, loaders: ["style", "css", "sass"] }
        ]
    },
    resolve: {
        extensions: ["", ".js", ".json", ".jsx"]
    }
};
