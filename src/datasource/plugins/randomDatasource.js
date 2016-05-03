import {assert} from 'chai'

export const TYPE_INFO = {
    type: "random",
    name: "Random",
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

export class Datasource {


    constructor(props = {}, history) {
        this.props = props;
        // Initialize with non random values to demonstrate loading of historic values
        this.history = history || []; // [{value: 10}, {value: 20}, {value: 30}, {value: 40}, {value: 50}]
        this.x = 0;

        if (this.history.length > 1) {
            this.x = history[history.length - 1].x + 1 || 0;
        }
    }

    // TODO: We can not edit datasources yet :)
    updateProps(props) {
        this.props = props;
    }

    getValues() {
        this.history.push(this.fetchValue());

        const maxValues = Number(this.props.maxValues) || 1000;
        while (this.history.length > maxValues) {
            this.history.shift();
        }

        return [...this.history];
    }

    fetchValue() {
        const props = this.props;
        const min = Number(props.min || 0);
        const max = Number(props.max || 100);
        let newValue = {x: this.x++, value: getRandomInt(min, max), value2: getRandomInt(min, max)};
        return newValue;
    }
}
