const color = require("bash-color");

const SOURCE_ENVS = "ENVS";
const SOURCE_ARGS = "ARGS";
const ENV_PREFIX = "NODE_CONFIG_";

//initialize with a config object e.g. const dc = Object.create(DockerConfig, config({}));
function DockerConfig(){}

DockerConfig.prototype.init = function(){
    this._overwriteWithEnvironmentVars();
};

DockerConfig.prototype._overwriteWithEnvironmentVars = function(){

    var envs = process.env;
    envs = Object.keys(envs);

    if(!envs ||envs.length <= 0){
        return this._println("[" + SOURCE_ENVS + "] -> No environment variables found wont overwrite config file values.");
    }

    var env = "";
    var enva = ["", ""];
    for(var i = 0; i < envs.length; i++){

        env = envs[i];

        if(process.env.hasOwnProperty(env)){

            if(env.indexOf(ENV_PREFIX) !== -1){

                enva = env.split(ENV_PREFIX);
                if(enva.length !== 2){
                    this._println("[" + SOURCE_ENVS + "] -> variable key " + env + " has a bad format.");
                    continue;
                }

                env = enva[1].toLowerCase(); // turns "NODE_CONF_DATABASE_CONSTRING" into "database_constring"
                env = env.replace(/_/g, '.');

                if(!env || !this._getRef(this, env)){
                    this._println("[" + SOURCE_ENVS + "] -> variable key " + env + " does not exist in the config file, it will be skipped.");
                    continue;
                }

                var valuePure = process.env[envs[i]];
                var value = valuePure;
                if(typeof valuePure === "string"){
                    try {
                        value = JSON.parse(valuePure);
                    } catch(ex){
                        //silent
                    }
                }

                this._println(this._getArgsOutput(SOURCE_ENVS, env, this._getRef(this, env), value));
                this._setRef(this, env, value);
            }
        }
    }
};

DockerConfig.prototype._getRef = function(o, s){

    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');

    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }

    return o;
};

DockerConfig.prototype._setRef = function(obj, prop, value){
    if (typeof prop === "string"){
        prop = prop.split(".");
    }

    if (prop.length > 1) {
        var e = prop.shift();
        this._setRef(obj[e] =
                Object.prototype.toString.call(obj[e]) === "[object Object]"
                    ? obj[e]
                    : {},
            prop,
            value);
    } else {
        obj[prop[0]] = value;
    }
};

DockerConfig.prototype._getArgsOutput = function(source, name, oldContent, newContent){

    oldContent = typeof oldContent === "object" ? JSON.stringify(oldContent) : oldContent;
    //newContent = typeof  newContent === "object" ? JSON.stringify(newContent) : newContent;

    return "|" + source + "| -> variable [" + name + "] set, overwriting [" + oldContent + "] with [new content..(secret)]";
};

DockerConfig.prototype._println = function(str){

    if(typeof str !== "string") {
        str = JSON.stringify(str, null, 1);
    }

    console.log(color.purple(str, true));
};

DockerConfig.prototype.makeGlobal = function(){
    global.CONFIG = this;
};

//static
DockerConfig.getConfig = function(obj){
    const config = Object.assign(new DockerConfig(), obj);
    config.init();
    return config;
};

module.exports = DockerConfig;