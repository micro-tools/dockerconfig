var dockerconfig = require("./../index.js");
var conf = require("./testconfig.json");

var config = dockerconfig.getConfig(conf);
config.makeGlobal();

console.log(CONFIG.database);
