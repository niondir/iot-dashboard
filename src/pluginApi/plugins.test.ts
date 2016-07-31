/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {assert} from "chai";
import * as Store from "../store";
import * as Action from "../actionNames";
import * as Redux from "redux";
import * as Plugins from "./plugins";


describe.only("pluginApi > plugins", () => {

    describe("reducers", () => {


        it(Action.STARTED_LOADING_PLUGIN_FROM_URL, () => {
            const store = Store.createEmpty(Store.testStoreOptions());

            store.dispatch({
                type: Action.STARTED_LOADING_PLUGIN_FROM_URL,
                url: "url1"
            });


            store.dispatch({
                type: Action.STARTED_LOADING_PLUGIN_FROM_URL,
                url: "url2"
            });

            assert.deepEqual(store.getState().pluginLoader, {loadingUrls: ["url1", "url2"]}, "url should be in store");
        });

        const finishLoadingActions = [
            Action.WIDGET_PLUGIN_FINISHED_LOADING,
            Action.WIDGET_PLUGIN_FINISHED_LOADING
        ];

        finishLoadingActions.forEach(
            (actionName) => {
                it("Action that leads to removal of URL: " + actionName, () => {
                    const store: any = Redux.createStore(
                        Redux.combineReducers({
                            pluginLoader: Plugins.pluginLoaderReducer
                        })
                    );

                    store.dispatch({
                        type: Action.STARTED_LOADING_PLUGIN_FROM_URL,
                        url: "url1"
                    });


                    store.dispatch({
                        type: Action.STARTED_LOADING_PLUGIN_FROM_URL,
                        url: "url2"
                    });

                    store.dispatch({
                        type: actionName,
                        url: "url1"
                    });

                    assert.deepEqual(store.getState().pluginLoader, {loadingUrls: ["url2"]}, "url should be in store");
                });
            }
        )


    })

})
;