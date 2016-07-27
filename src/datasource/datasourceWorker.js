/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as Datasource from './datasource'
import DatasourcePlugins from './datasourcePlugins'
import * as Store from '../store'

let heartbeat;

export function start(store) {
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
