var dockerconfig = require("./../index.js");
var conf = require("./testconfig.json");
var assert = require("assert");


describe("dockerconfig", () => {

    before(() => {
        process.env["NODE_CONFIG_DATABASE_POSTGRES_CONSTRING"] = '[{ \"host\": \"123\", \"port\": 123 }]';
        process.env["NODE_CONFIG_ENABLEFEATUREX"] = '1';

        var config = dockerconfig.getConfig(conf);
        config.makeGlobal();
    });

    it("sets the expected values", () =>
        assert.deepEqual(CONFIG.database, { postgres: { constring: [ {host: "123", port: 123} ] } })
    );

    it("sets config values with uppercase letters", () =>
        assert.deepEqual(CONFIG.enableFeatureX, true)
    )
});
