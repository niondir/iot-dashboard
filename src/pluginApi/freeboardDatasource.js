/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import scriptloader from '../util/scriptLoader';
import * as _ from 'lodash'

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

        const newInstanceCallback = function (instance) {
            this.instance = instance;
            instance.updateNow();
        }.bind(this);

        const updateCallback = function (newData) {
            this.data = newData;
        }.bind(this);

        // TODO: Maybe no needed anymore when we take care of dependencies elsewhere
        if (TYPE_INFO.dependencies) {
            scriptloader.loadScript([...TYPE_INFO.dependencies], {success: createNewInstance});
        }
        else {
            createNewInstance();
        }

        function createNewInstance() {
            newInstance(props, newInstanceCallback, updateCallback);
        }

    }.bind(this, newInstance)
}
