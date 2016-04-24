import {valuesOf} from '../util/collection'
import _ from 'lodash'

/**
 * Connects a datasource to the application state
 */
export class DataSourcePlugin {
    constructor(module, store) {
        console.assert(module.TYPE_INFO, "Missing TYPE_INFO on datasource module. Every module must export TYPE_INFO");
        this.typeInfo = module.TYPE_INFO;
        this.Datasource = module.Datasource;

        this.store = store;

        this.instances = {};

        this.unsubscribe = store.subscribe(this.handleStateChange.bind(this));
    }

    getDsState(id) {
        return this.store.datasources[id];
    }

    get type() {
        return this.typeInfo.type;
    }

    get name() {
        return this.typeInfo.name;
    }

    get settings() {
        return this.typeInfo.settings;
    }

    getDatasourceState(id) {
        const state = this.store.getState();
        return state.datasources[id];
    }

    getOrCreateInstance(id) {
        let instance = this.instances[id];
        if (!instance) {
            const dsState = this.getDatasourceState(id);
            instance = new this.Datasource(dsState.props, dsState.data);
            instance.props = dsState.props;
            this.instances[id] = instance;
        }
        return instance;
    }

    getInstance(id) {
        return this.instances[id];
    }

    handleStateChange() {
        const state = this.store.getState();
        valuesOf(state.datasources).forEach(dsState => this.updateDatasource(dsState))
    }

    updateDatasource(dsState) {
        const instance = this.getInstance(dsState.id);
        if (!instance) {
            // This is normal to happen when the app starts,
            // since the state already contains the id's before plugin instances are loaded
            //console.warn("Can not find Datasource instance with id " + dsState.id + ". Skipping Update!");
            return;
        }

        const oldProps = instance.props;
        const newProps = dsState.props;
        if (oldProps !== newProps) {
            if (_.isFunction(instance.propsWillUpdate)) {
                instance.propsWillUpdate(newProps);
            }
            instance.props = newProps;
        }
    }

    dispose() {
        this.unsubscribe();
    }


}