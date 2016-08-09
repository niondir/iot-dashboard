/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as _ from 'lodash'

// **newInstance(settings, newInstanceCallback, updateCallback)** (required) : A function that will be called when a new instance of this plugin is requested.
// * **settings** : A javascript object with the initial settings set by the user. The names of the properties in the object will correspond to the setting names defined above.
// * **newInstanceCallback** : A callback function that you'll call when the new instance of the plugin is ready. This function expects a single argument, which is the new instance of your plugin object.
// * **updateCallback** : A callback function that you'll call if and when your datasource has an update for freeboard to recalculate. This function expects a single parameter which is a javascript object with the new, updated data. You should hold on to this reference and call it when needed.


export function create(newInstance, TYPE_INFO) {

    return function FreeboardDatasource(props = {}) {
        this.instance = null;
        this.data = history;
        this.fetchData = function (resolve, reject) {
            if (!this.data) {
                resolve();
                return;
            }
            const data = this.data;
            this.data = null;
            if (_.isArray(data)) {
                resolve(data);
            } else {
                return resolve([data]);
            }
        }.bind(this);
        this.dispose = function() {
            this.instance.onDispose();
        }.bind(this);

        this.datasourceWillReceiveProps = function (newProps) {
            if (newProps.settings !== this.props.settings) {
                console.log("Updating Datasource settings");
                this.instance.onSettingsChanged(newProps);
            }
        }.bind(this);

        const newInstanceCallback = function (instance) {
            this.instance = instance;
            instance.updateNow();
        }.bind(this);

        const updateCallback = function (newData) {
            this.data = newData;
        }.bind(this);

        createNewInstance();

        function createNewInstance() {
            newInstance(props, newInstanceCallback, updateCallback);
        }

    }.bind(this)
}
