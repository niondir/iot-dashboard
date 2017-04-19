declare module "loadjs" {
    interface Options {
        success: () => void;
        error: (error: Error) => void;
    }
    function loadjs(paths: Array<string>, options: Options): void;

    export = loadjs;
}