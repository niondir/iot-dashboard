import loadjs from 'loadjs';
import _ from 'lodash'

// **newInstance(settings, newInstanceCallback, updateCallback)** (required) : A function that will be called when a new instance of this plugin is requested.
// * **settings** : A javascript object with the initial settings set by the user. The names of the properties in the object will correspond to the setting names defined above.
// * **newInstanceCallback** : A callback function that you'll call when the new instance of the plugin is ready. This function expects a single argument, which is the new instance of your plugin object.
// * **updateCallback** : A callback function that you'll call if and when your datasource has an update for freeboard to recalculate. This function expects a single parameter which is a javascript object with the new, updated data. You should hold on to this reference and call it when needed.


export function create(newInstance, TYPE_INFO) {

    return function FreeboardDatasource(newInstance, props = {}, history = []) {
        this.instance = null;
        this.data = history;
        this.getValues = function () {
            if (_.isArray(this.data)) {
                return this.data;
            }
            return [this.data];
        }.bind(this);

        this.updateProps = function (newProps) {
            console.log("Updating Datasource props");
            this.instance.onSettingsChanged(newProps)
        }.bind(this);

        let newInstanceCallback = function (instance) {
            this.instance = instance;
            instance.updateNow();
        }.bind(this);

        let updateCallback = function (newData) {
            this.data = newData;
        }.bind(this);

        // TODO: Maybe no needed anymore when we take care of dependencies elsewhere
        if (TYPE_INFO.dependencies) {
            loadjs([...TYPE_INFO.dependencies], createNewInstance);
        }
        else {
            createNewInstance();
        }

        function createNewInstance() {
            newInstance(props, newInstanceCallback, updateCallback);
        }

    }.bind(this, newInstance)
}
