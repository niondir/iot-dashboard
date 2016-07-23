



declare module "loadjs" {
    interface Options {
        success: () => void;
    }
    function loadjs(paths: Array<string>, options: Options): void;

    export = loadjs;
}