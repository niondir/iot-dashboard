import * as Datasource from './datasource'
import DatasourcePlugins from './datasourcePlugins'
import * as Store from '../store'

let heartbeat;

export function start() {
    if (heartbeat) {
        clearInterval(heartbeat);
    }
    heartbeat = setInterval(()=> {
        Store.get().dispatch(Datasource.fetchDatasourceData());
    }, 1000);
}

export function stop() {
    if (heartbeat) {
        clearInterval(heartbeat);
        heartbeat = null;
    }
}
