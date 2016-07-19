/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as ServerRenderer from './serverRenderer'
import {assert} from 'chai'
import * as store from './store'

describe('Render Serverside', function () {
    describe('render initial state', function () {
        it('should return some proper html', function () {
            const html = ServerRenderer.render(store.createDefault({log: false}));

            assert.isString(html, "The rendered HTML needs to be a string");
            assert.include(html, '<div', 'rendered HTML contains at least an open div');
            assert.include(html, '</div>', 'rendered HTML contains at least an closed div');

            // TODO: Make assumptions about the state in store.getState();
        });
    });
});