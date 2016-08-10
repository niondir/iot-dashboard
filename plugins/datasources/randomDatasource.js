/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function () {

    const TYPE_INFO = {
        type: "random",
        name: "Random",
        description: "A datasource that provides a random value each tick",
        settings: [
            {
                id: "maxValues",
                name: "Max Values",
                description: "Maximum number of values stored",
                type: "number"
            },
            {
                id: "min",
                name: "Min Value",
                type: "number",
                defaultValue: 0
            },
            {
                id: "max",
                name: "Max Value",
                type: "number",
                defaultValue: 100
            }
        ]
    };


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    class Datasource {


        constructor(props) {
            props.setFetchInterval(1200);
            const history = props.state.data;
            // Initialize with non random values to demonstrate loading of historic values
            this.history = history || []; // [{value: 10}, {value: 20}, {value: 30}, {value: 40}, {value: 50}]
            this.x = 0;

            if (this.history.length > 1) {
                this.x = history[history.length - 1].x + 1 || 0;
            }
        }

        datasourceWillReceiveProps(props) {
        }

        fetchData(resolve, reject) {
            resolve(this.fetchValue())
        }

        getValues() {
            this.history.push(this.fetchValue());

            const maxValues = Number(this.props.state.settings.maxValues) || 1000;
            while (this.history.length > maxValues) {
                this.history.shift();
            }

            return this.history;
        }

        fetchValue() {
            const settings = this.props.state.settings;
            const min = Number(settings.min || 0);
            const max = Number(settings.max || 100);
            const newValue = {x: this.x++, value: getRandomInt(min, max), value2: getRandomInt(min, max)};
            return newValue;
        }

        dispose() {
            this.history = [];
            console.log("Random Datasource destroyed");
        }
    }


    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Datasource);

})(window);
