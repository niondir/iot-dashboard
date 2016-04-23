import * as Datasource from './datasource'
import DatasourcePlugins from './datasourcePlugins'
import {valuesOf} from '../util/collection'

export function initializeWorkers(dsStates, dispatch) {
    const heartbeat = setInterval(()=> {
        dispatch(Datasource.fetchDatasourceData());
    }, 1000);
}
