/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as _ from "lodash";
import {DashboardStore} from "../store";
import {IPluginFactory, IPlugin} from "../pluginApi/pluginRegistry";
import {IDatasourceState} from "./datasource";
import Unsubscribe = Redux.Unsubscribe;


export interface IDatasourcePlugin extends IPlugin {
    new(props: any): IDatasourcePlugin
    props: any
    datasourceWillReceiveProps?: (newProps: any) => void
    dispose?: () => void
    getValues(): any[] // TODO: Might get depricated
}


/**
 * Connects a datasource to the application state
 */
export default class DataSourcePluginFactory implements IPluginFactory<IDatasourcePlugin> {

    private _instances: {[id: string]: IDatasourcePlugin} = {};
    private _unsubscribe: Unsubscribe;
    private _disposed: boolean = false;

    // TODO: type datasource plugin constructor?
    constructor(private _type: string, private _datasource: IDatasourcePlugin, private _store: DashboardStore) {
        this._unsubscribe = _store.subscribe(this.handleStateChange.bind(this));
    }

    get type() {
        return this._type;
    }

    get disposed() {
        return this._disposed;
    }

    getDatasourceState(id: string) {
        const state = this._store.getState();
        return state.datasources[id];
    }

    /**
     * Better use getInstance or createInstance directly!
     */
    getOrCreateInstance(id: string) {
        if (!this._instances[id]) {
            return this.createInstance(id)
        }
        return this.getInstance(id);
    }

    createInstance(id: string): IDatasourcePlugin {
        if (this._disposed === true) {
            throw new Error("Try to create datasource of destroyed type: " + JSON.stringify({id, type: this.type}));
        }
        if (this._instances[id] !== undefined) {
            throw new Error("Can not create datasource instance. It already exists: " + JSON.stringify({
                    id,
                    type: this.type
                }));
        }

        const dsState = this.getDatasourceState(id);
        const props = {
            state: dsState
        };
        const instance = new this._datasource(props);
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
            throw new Error('Datasource must implement "getValues(): any[]" but is missing. ' + JSON.stringify({
                    id,
                    type: this.type
                }));
        }

        this._instances[id] = instance;
        return instance;
    }

    getInstance(id: string) {
        if (this._disposed === true) {
            throw new Error("Try to get datasource of destroyed type. " + JSON.stringify({id, type: this.type}));
        }
        if (!this._instances[id]) {
            throw new Error("No running instance of datasource. " + JSON.stringify({id, type: this.type}));
        }
        return this._instances[id];
    }

    dispose() {
        this._disposed = true;
        _.valuesIn<IDatasourcePlugin>(this._instances).forEach((instance) => {
            if (_.isFunction(instance.dispose)) {
                try {
                    instance.dispose();
                }
                catch (e) {
                    console.error("Failed to destroy Datasource instance", instance);
                }
            }
        });
        this._instances = {};
        this._unsubscribe();
    }

    handleStateChange() {
        const state = this._store.getState();
        _.valuesIn<IDatasourceState>(state.datasources).forEach(dsState => this.updateDatasource(dsState))
    }

    updateDatasource(dsState: IDatasourceState) {
        const instance = this._instances[dsState.id];
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