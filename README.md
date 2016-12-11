# dockerconfig
- easy nodejs config for docker (overwrite with ENV vars)
- updated: you must not use "_" in your variable names
- check ./test if you dont understand the readme example (you can run "npm test" to try it)

```javascript
//somewhere in your init script/class

const dockerconfig = require("dockerconfig");

//myConfigData = { port: 1234, nested: { something: "no" } };
const myConfigData = require("./config.json");
const config = dockerconfig.getConfig(myConfigData);
config.makeGlobal();

//somewhere else

console.log(CONFIG.port);
console.log(CONFIG.nested.something);

//your dockerfile

FROM node:6-onbuild
```

```bash
# building & run docker image
# with environment variables to overwrite config data

docker build -t my-config-test .
docker run -e NODE_CONFIG_PORT=5555 -e NODE_CONFIG_NESTED_SOMETHING=yes my-config-test

# outputs:

# 555 instead of 1234
# "yes" instead of "no"
```

## config versioning

- new in *1.4.0*
- optional

Versioning helps you to keep application-image and deployment-configuration (via environment-variables) in sync, 
since it's not always possible to keep all config-changes backwards-compatible or provide sane defaults.   

### Usage

In your application/image add a key *configVersion* to your *config.json* (or rather: config-object). 
The *configVersion* must be a number, using timestamps is recommended:

```json
{
  "configVersion": 1464091200
}
```

Next add the environment variable *NODE_CONFIG_CONFIGVERSION* with the very same value when running your container:

```bash
$ docker run -e NODE_CONFIG_CONFIGVERSION=1464091200 my-application 
```

Now `dockerconfig.getConfig()` will throw an exception on version-mismatch.

## Authors

- Christian Fröhlingsdorf, <chris@5cf.de> (original author)
- Elmar Athmer, <elmar@athmer.org> (contributor) 
