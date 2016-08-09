import loadjs = require('loadjs');


// This is a class because we can not mock it on module level.
export default class ScriptLoader {
    static loadScript(paths: Array<string>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                loadjs(paths, {
                    success: () => {
                        resolve();
                    },
                    error: (error: Error) => {
                        reject(error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
