/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {renderToString} from 'react-dom-server'
import {Provider} from 'react-redux'
import Layout from './pageLayout'
import * as React from 'react' //TSC needs a reference to react
import * as Store from './store'

// Render the component as string
export function render(store: Store.DashboardStore) {
    return renderToString(
        <Provider store={store}>
            <Layout/>
        </Provider>
    )
}
