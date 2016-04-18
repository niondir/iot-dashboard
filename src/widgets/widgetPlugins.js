
export class PluginRegistry {

    constructor() {
       this.widgets = {}
    }

    register(module) {
        console.assert(module.TYPE_INFO, "Missing TYPE_INFO on widget module. Every module must export TYPE_INFO");
        this.widgets[module.TYPE_INFO.type] = {
            ...module.TYPE_INFO,
            widget: module.Widget,
            configDialog: module.ConfigDialog ? module.ConfigDialog : null
        }
    }

    getWidget(type:String) {
        return this.widgets[type];
    }

    getWidgets():Array {
        return Object.keys(this.widgets).map(key => this.widgets[key]);
    }
}

const WidgetPlugins = new PluginRegistry();
export default WidgetPlugins;

