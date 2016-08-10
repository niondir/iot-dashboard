/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


import {assert} from "chai";
import * as Store from "../store";
import * as Sinon from "sinon";
import {DatasourceScheduler} from "./datasourceScheduler";

describe("Datasource > DatasourceScheduler", function () {

    it("doFetchData is called", () => {
        const clock = Sinon.useFakeTimers();
        const store = Store.createEmpty(Store.testStoreOptions());
        const datasourceScheduler = new DatasourceScheduler(null, store);
        const doFetchDataStub = Sinon.stub(datasourceScheduler, "doFetchData");


        afterEach(() => {
            clock.restore();
            datasourceScheduler.dispose();
        });

        datasourceScheduler.start();
        clock.tick(1000);

        assert.isTrue(doFetchDataStub.calledOnce, "doFetchData was called once");
    })
});
