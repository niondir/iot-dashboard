import loadjs = require('loadjs');


// This is a class because we can not mock it on module level.
export default class ScriptLoader {
    static loadScript(paths: Array<string>, options: any) {
        return loadjs(paths, options);
    }
}
