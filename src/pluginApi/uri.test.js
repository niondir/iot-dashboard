import {assert} from 'chai'
import URI from 'urijs'


describe('Uri Tests', function () {
    describe('Resolve URIs for plugin loading', function () {
        it("Check different uri's on absolute base", function () {
            var uri = URI("https://www.domain.de/folder/file.min.js");

            var dotRelative = "./a/b.js";
            var relative = "a/b.js";
            var absolute = "/a/b.js";

            assert.equal(uri.toString(), "https://www.domain.de/folder/file.min.js");
            assert.equal(URI(dotRelative).absoluteTo(uri).toString(), "https://www.domain.de/folder/a/b.js");
            assert.equal(URI(relative).absoluteTo(uri).toString(), "https://www.domain.de/folder/a/b.js");


            assert.equal(URI(absolute).absoluteTo(uri).toString(), "https://www.domain.de/a/b.js");

        });

        it("Check different uri's on relative base", function () {
            var uri = "/folder/file.min.js";

            var dotRelative = "./a/b.js";
            var absolute = "/a/b.js";

            assert.equal(uri.toString(), "/folder/file.min.js");
            assert.equal(URI(dotRelative).absoluteTo(uri).toString(), "/folder/a/b.js");


            assert.equal(URI(absolute).absoluteTo(uri).toString(), "/a/b.js");

        });
    });
});

