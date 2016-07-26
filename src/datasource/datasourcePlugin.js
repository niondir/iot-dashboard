/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as _ from 'lodash'

/**
 * Connects a datasource to the application state
 */
// TODO: Rename to ...Factory
export class DataSourcePlugin {
    constructor(module, store) {
        console.assert(module.TYPE_INFO, "Missing TYPE_INFO on datasource module. Every module must export TYPE_INFO");
        this._type = module.TYPE_INFO.type;
        this.Datasource = module.Datasource;

        this.store = store;

        this.instances = {};

        this.unsubscribe = store.subscribe(this.handleStateChange.bind(this));
        this.disposed = false;
    }

    get type() {
        return this._type;
    }

    getDatasourceState(id) {
        const state = this.store.getState();
        return state.datasources[id];
    }

    /**
     * Better use getInstance or createInstance directly!
     */
    getOrCreateInstance(id) {
        if (!this.instances[id]) {
            return this.createInstance(id)
        }
        return this.getInstance(id);
    }

    createInstance(id) {
        if (this.disposed === true) {
            throw new Error("Try to create datasource of destroyed type: " + JSON.stringify({id, type: this.type}));
        }
        if (this.instances[id] !== undefined) {
            throw new Error("Can not create datasource instance. It already exists: " + JSON.stringify({id, type: this.type}));
        }

        const dsState = this.getDatasourceState(id);
        const props = {
            state: dsState
        };
        const instance = new this.Datasource(props);
        instance.props = props;

        // Bind API functions to instance
        if (_.isFunction(instance.datasourceWillReceiveProps)) {
            instance.datasourceWillReceiveProps = instance.datasourceWillReceiveProps.bind(instance);
        }
        if (_.isFunction(instance.dispose)) {
            instance.dispose = instance.dispose.bind(instance);
        }
        if (_.isFunction(instance.getValues)) {
            instance.getValues = instance.getValues.bind(instance);
        } else {
            throw new Error('Datasource must implement "getValues(): any[]" but is missing. ' + JSON.stringify({id, type: this.type}));
        }

        this.instances[id] = instance;
        return instance;
    }

    getInstance(id) {
        if (this.disposed === true) {
            throw new Error("Try to get datasource of destroyed type. " + JSON.stringify({id, type: this.type}));
        }
        if (!this.instances[id]) {
            throw new Error("No running instance of datasource. " + JSON.stringify({id, type: this.type}));
        }
        return this.instances[id];
    }

    dispose() {
        this.disposed = true;
        _.valuesIn(this.instances).forEach((instance) => {
            if (_.isFunction(instance.dispose)) {
                try {
                    instance.dispose();
                }
                catch (e) {
                    console.error("Failed to destroy Datasource instance", instance);
                }
            }
        });
        this.instances = [];
        this.unsubscribe();
    }

    handleStateChange() {
        const state = this.store.getState();
        _.valuesIn(state.datasources).forEach(dsState => this.updateDatasource(dsState))
    }

    updateDatasource(dsState) {
        const instance = this.instances[dsState.id];
        if (!instance) {
            // This is normal to happen when the app starts,
            // since the state already contains the id's before plugin instances are loaded
            //console.warn("Can not find Datasource instance with id " + dsState.id + ". Skipping Update!");
            return;
        }

        const oldProps = instance.props;
        const newProps = _.assign({oldProps, state: dsState});
        if (oldProps !== newProps) {
            if (_.isFunction(instance.datasourceWillReceiveProps)) {
                instance.datasourceWillReceiveProps(newProps);
            }
            instance.props = newProps;
        }
    }
}