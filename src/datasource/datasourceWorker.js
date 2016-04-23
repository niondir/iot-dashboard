import * as Datasource from './datasource'
import DatasourcePlugins from './datasourcePlugins'
import {valuesOf} from '../util/collection'

// TODO: Should we have not serializable workers in the state and just skip on serialization?
let workers = [];

export function initializeWorkers(dsStates, dispatch) {
    const heartbeat = setInterval(()=> {
        dispatch(Datasource.fetchDatasourceData());
    }, 1000);

    return;
    valuesOf(dsStates).forEach(dsState => {
        const dsPlugin = DatasourcePlugins.getPlugin(dsState.type);

        console.log("plugin", dsPlugin);

        const dsInstance = new dsPlugin.Datasource();

        workers.push(new DatasourceWorker(dsState, dsInstance, dispatch))
    })
}

export function addWorker(dsState, dispatch) {
    const dsPlugin = DatasourcePlugins.getPlugin(dsState.type);
    console.log("plugin", dsPlugin);
    const dsInstance = new dsPlugin.Datasource();
    workers.push(new DatasourceWorker(dsState, dsInstance, dispatch))
}

export function removeWorker(dsState, dispatch) {
    const dsPlugin = DatasourcePlugins.getPlugin(dsState.type);
    console.log("plugin", dsPlugin);
    const dsInstance = new dsPlugin.Datasource();
    workers.push(new DatasourceWorker(dsState, dsInstance, dispatch))
}

export default class DatasourceWorker {

    constructor(dsState, dsInstance, dispatch) {
        return;
        this.dispatch = dispatch;

        dispatch(Datasource.setDatasourceData(dsState.id, dsInstance.getPastValues()));
        this.timer = setInterval(()=> {
            dispatch(Datasource.appendDatasourceData(dsState.id, dsInstance.getNewValues()));
        }, 1000);
    }

    dispose() {
        clearInterval(this.timer);
    }
}