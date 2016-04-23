import * as Datasource from './datasource'
import DatasourcePlugins from './datasourcePlugins'
import {valuesOf} from '../util/collection'

let workers = [];

export function updateWorkers(datasources, dispatch) {
    workers.forEach(worker => {
        worker.dispose();
    });
    workers = [];
    valuesOf(datasources).forEach(dsState => {
        const dsPlugin = DatasourcePlugins.getPlugin(dsState.type);

        console.log("plugin", dsPlugin)

        const dsInstance = new dsPlugin.Datasource();

        workers.push(new DatasourceWorker(dsState, dsInstance, dispatch))
    })
}

export default class DatasourceWorker {

    constructor(dsState, dsInstance, dispatch) {
        this.dispatch = dispatch;

        this.timer = setInterval(()=> {
            dispatch(Datasource.setDatasourceData(dsState.id, dsInstance.getNewValues()));
        }, 1000);
    }

    dispose() {
        clearInterval(this.timer);
    }
}