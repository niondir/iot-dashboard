
//import './datasource/datasource'


/* inject:tests */
import './datasource/datasourcePlugins.test.js'
import './widgets/widgetPlugins.test.js'
import './datasource/plugins/randomDatasource.test.js'
/* endinject */

var assert = require('chai').assert;
describe('Example Array', function() {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});
