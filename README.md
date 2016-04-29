# dockerconfig
- easy nodejs config for docker (overwrite with ENV vars)

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

- author: Christian Fröhlingsdorf, <chris@5cf.de>