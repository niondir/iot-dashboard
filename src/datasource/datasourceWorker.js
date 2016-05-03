import * as Datasource from './datasource'
import DatasourcePlugins from './datasourcePlugins'
import store from '../store'

let heartbeat;

export function start() {
    if (heartbeat) {
        clearInterval(heartbeat);
    }
    heartbeat = setInterval(()=> {
        store.dispatch(Datasource.fetchDatasourceData());
    }, 1000);
}

export function stop() {
    if (heartbeat) {
        clearInterval(heartbeat);
        heartbeat = null;
    }
}
