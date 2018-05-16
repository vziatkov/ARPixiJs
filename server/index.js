const path = require("path");
const express = require("express");
const webpack = require("webpack");
const webpackMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const config = require("../config/webpack.config.js");
const fs = require("fs");

const settings = JSON.parse(fs.readFileSync(path.join(__dirname, "/settings.json"), "utf8"));

const isDeveloping = process.env.NODE_ENV !== "production";
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();
const randomNum = max => Math.floor(Math.random() * max);

if (isDeveloping) {
    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: "src",
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false,
        },
    });
    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.get("/game", (req, res) => {
        res.write(middleware.fileSystem.readFileSync(path.join(__dirname, "/../dist/index.html")));
        res.end();
    });
} else {
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "index.html"));
    });
}

app.use(express.static(path.join(__dirname, "/../dist")));

app.get("/result", (req, res) => {
    const result = [];
    let maxСoincidence = 0;
    let winMessage = "No Win";
    let isFreeSpin = false;
    for (let reelIndex = 0; reelIndex < settings.countReels; reelIndex += 1) {
        const reelValue = settings.reelsData[randomNum(settings.reelsData.length)];
        const sameSymbols = result.filter(x => x === reelValue).length + 1;
        maxСoincidence = maxСoincidence < sameSymbols ? sameSymbols : maxСoincidence;
        isFreeSpin = reelValue === settings.freeSpinSymbol ? true : isFreeSpin;
        result.push(reelValue);
    }
    if (isFreeSpin) {
        winMessage = "FreeSpin";
    }
    if (maxСoincidence === settings.smallWin) {
        winMessage = "Small Win";
    }
    if (maxСoincidence >= settings.bigWin) {
        winMessage = "Big Win!";
    }
    res.write(JSON.stringify({ result, winMessage, isFreeSpin }));
    res.end();
});

app.listen(port, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
        console.log(err);
    }
  // eslint-disable-next-line no-console
    console.info(`Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
});
