import * as Server from './server'

var assert = require('chai').assert;


describe('Render Serverside', function() {
    describe('render initial state', function () {
        it('should return some proper html', function () {
            const html = Server.html;

            assert.isString(html, "The rendered HTML needs to be a string");
            assert.include(html, '<div', 'rendered HTML contains at least an open div');
            assert.include(html, '</div>', 'rendered HTML contains at least an closed div');
            
            // TODO: Make assumptions about the state
        });
    });
});