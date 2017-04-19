/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {assert} from 'chai'
import * as URI from 'urijs'


describe('pluginApi > uri', function () {
    describe('Resolve URIs for plugin loading', function () {
        it("Check different uri's on absolute base", function () {
            const uri = URI("https://www.domain.de/folder/file.min.js");

            const dotRelative = "./a/b.js";
            const relative = "a/b.js";
            const absolute = "/a/b.js";

            assert.equal(uri.toString(), "https://www.domain.de/folder/file.min.js");
            assert.equal(URI(dotRelative).absoluteTo(uri).toString(), "https://www.domain.de/folder/a/b.js");
            assert.equal(URI(relative).absoluteTo(uri).toString(), "https://www.domain.de/folder/a/b.js");


            assert.equal(URI(absolute).absoluteTo(uri).toString(), "https://www.domain.de/a/b.js");

        });

        it("Check different uri's on relative base", function () {
            const uri = "/folder/file.min.js";

            const dotRelative = "./a/b.js";
            const absolute = "/a/b.js";

            assert.equal(uri.toString(), "/folder/file.min.js");
            assert.equal(URI(dotRelative).absoluteTo(uri).toString(), "/folder/a/b.js");


            assert.equal(URI(absolute).absoluteTo(uri).toString(), "/a/b.js");

        });
    });
});

