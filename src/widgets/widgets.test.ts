/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {assert} from "chai";
import * as Store from "../store";
import * as Widgets from "./widgets";
import * as AppState from "../appState";
import * as _ from "lodash";

describe('Widget', function () {
    describe('action', function () {
        it("create Widget", function () {
            const store = Store.createEmpty(Store.testStoreOptions());

            store.dispatch(Widgets.createWidget("my-widget-type", {foo: "bar"}));

            const state: AppState.State = store.getState();

            assert.equal(_.keysIn(state.widgets).length, 1);

            const myWidget: any = _.find(_.valuesIn(state.widgets),
                ((widget: Widgets.IWidgetState) => widget.type === "my-widget-type"));

            assert.deepEqual(myWidget.settings, {foo: "bar"});
            assert.equal(myWidget.type, "my-widget-type");
            assert.equal(myWidget.row, 0);
            assert.equal(myWidget.col, 0);
            assert.equal(myWidget.width, 3);
            assert.equal(myWidget.height, 3);
            assert.equal(myWidget.availableHeightPx, 253);
        });

        it("add Widget", function () {
            const store = Store.createEmpty(Store.testStoreOptions());

            store.dispatch(Widgets.addWidget("my-widget-type", {foo: "bar"}, 1, 2, 3, 4));

            const state: AppState.State = store.getState();

            assert.equal(_.keysIn(state.widgets).length, 1);

            const myWidget: any = _.find(_.valuesIn(state.widgets),
                ((widget: Widgets.IWidgetState) => widget.type === "my-widget-type"));

            assert.deepEqual(myWidget.settings, {foo: "bar"});
            assert.equal(myWidget.type, "my-widget-type");
            assert.equal(myWidget.row, 1);
            assert.equal(myWidget.col, 2);
            assert.equal(myWidget.width, 3);
            assert.equal(myWidget.height, 4);
            assert.equal(myWidget.availableHeightPx, 363);

            assert.deepEqual(
                {
                    id: myWidget.id,
                    type: "my-widget-type",
                    settings: {foo: "bar"},
                    row: 1,
                    col: 2,
                    width: 3,
                    height: 4,
                    availableHeightPx: 363
                }
                , myWidget
            );


        });

        it("calcNewWidgetPosition() calculates the position correctly", function () {
            const result1 = Widgets.calcNewWidgetPosition({"widget1": {col: 0, row: 0, width: 2, height: 4}});
            assert.equal(result1.col, 2, "col 2");
            assert.equal(result1.row, 0, "row 0");


            const result2 = Widgets.calcNewWidgetPosition({"widget2": {col: 0, row: 0, width: 12, height: 4}});
            assert.equal(result2.col, 0);
            assert.equal(result2.row, 4);
        });

        it("delete Widget", function () {
            const store = Store.createEmpty(Store.testStoreOptions());

            store.dispatch(Widgets.addWidget("my-widget-type", {foo: "bar"}, 1, 2, 3, 4));
            assert.equal(_.keysIn(store.getState().widgets).length, 1);

            _.valuesIn(store.getState().widgets).forEach((widget: Widgets.IWidgetState) => {
                store.dispatch(Widgets.deleteWidget(widget.id));
            });
            assert.equal(_.keysIn(store.getState().widgets).length, 0);


        });

        it("update Widget settings", function () {
            const store = Store.createEmpty(Store.testStoreOptions());

            store.dispatch(Widgets.addWidget("my-widget-type", {asterix: "obelix"}, 1, 2, 3, 4));


            const id = _.keysIn(store.getState().widgets)[0];
            const widget1 = store.getState().widgets[id];

            store.dispatch(Widgets.updateWidgetSettings(id, {tom: "jerry"}));

            const widget2 = store.getState().widgets[id];

            assert.isOk(widget1);
            assert.isOk(widget2);
            assert.notEqual(widget1, widget2, "Widgets must differ");
            assert.deepEqual(widget1.settings, {asterix: "obelix"});
            assert.deepEqual(widget2.settings, {tom: "jerry"});

        });
        it("update Widget layout based on data from react-grid-view", function () {
            const store = Store.createEmpty(Store.testStoreOptions());

            store.dispatch(Widgets.addWidget("my-widget-type", {foo: "bar"}, 1, 2, 3, 4));
            const id = _.keysIn(store.getState().widgets)[0];

            const widget1 = store.getState().widgets[id];
            assert.equal(widget1.row, 1);
            assert.equal(widget1.col, 2);
            assert.equal(widget1.width, 3);
            assert.equal(widget1.height, 4);

            store.dispatch(Widgets.updateLayout([
                {i: id, y: 10, x: 20, w: 30, h: 40},
                {i: "layout-without-widget", y: 11, x: 22, w: 33, h: 44}
            ]));

            const widget2 = store.getState().widgets[id];
            assert.equal(widget2.row, 10);
            assert.equal(widget2.col, 20);
            assert.equal(widget2.width, 30);
            assert.equal(widget2.height, 40);
        });

        it("do not update widget if no layout provided", function () {
            const store = Store.createEmpty(Store.testStoreOptions());

            store.dispatch(Widgets.addWidget("widget-without-layout", {foo: "bar"}, 1, 2, 3, 4));
            const id = _.keysIn(store.getState().widgets)[0];

            const widget1 = store.getState().widgets[id];
            assert.equal(widget1.row, 1);
            assert.equal(widget1.col, 2);
            assert.equal(widget1.width, 3);
            assert.equal(widget1.height, 4);

            store.dispatch(Widgets.updateLayout([{
                i: "layout-without-widget", y: 11, x: 22, w: 33, h: 44
            }]));

            const widget2 = store.getState().widgets[id];

            assert.equal(widget1, widget2);
        });

    });
});