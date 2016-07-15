import * as ServerRenderer from './serverRenderer'
import {assert} from 'chai'
import store from './store'

describe('Render Serverside', function () {
    describe('render initial state', function () {
        it('should return some proper html', function () {
            const html = ServerRenderer.render(store);

            assert.isString(html, "The rendered HTML needs to be a string");
            assert.include(html, '<div', 'rendered HTML contains at least an open div');
            assert.include(html, '</div>', 'rendered HTML contains at least an closed div');

            // TODO: Make assumptions about the state in store.getState();
        });
    });
});