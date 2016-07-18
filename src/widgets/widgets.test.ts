import {assert} from "chai";
import * as Store from "../store";
import * as ServerRenderer from "../serverRenderer";
import * as widgets from "./widgets";
import * as AppState from "../appState";
import * as _ from "lodash";

describe('Widget', function () {
    describe('action', function () {
        it("can add Widget", function () {
            // TODO: Initialize app with minimum state

            var store = Store.create({log: false});
            const html = ServerRenderer.render(store);
            store.dispatch(widgets.addWidget("my-widget-type", {}, 1, 2, 3, 4));

            const state: AppState.State = store.getState();
            // TODO: Check for whole widgets object
            assert.equal(_.keysIn(state.widgets).length, 4)

        });
        /*
        it("can delete Widget", function () {
            var store = Store.create({log: false});
            const html = ServerRenderer.render(store);
            //store.dispatch(widgets.addWidget())
            //store.dispatch(widgets.deleteWidget())

        });
        it("can update Widget settings", function () {
            var store = Store.create({log: false});
            const html = ServerRenderer.render(store);
            // store.dispatch(widgets.addWidget())
            // store.dispatch(widgets.deleteWidget())
            // store.dispatch(widgets.updateWidgetSettings())
            // store.dispatch(widgets.updateLayout())
        });
        it("can update Widget layout based on data from react-grid-view", function () {
            var store = Store.create({log: false});
            const html = ServerRenderer.render(store);
            //store.dispatch(widgets.addWidget())
            //store.dispatch(widgets.deleteWidget())
            //store.dispatch(widgets.updateWidgetSettings())
            //store.dispatch(widgets.updateLayout())
        });     */

    });
});