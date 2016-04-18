import {assert} from 'chai'

export const TYPE_INFO = {
    type: "random",
    defaultProps: {
        name: "Text"
    }
};


export class Datasource {

    constructor() {
        // Initialize with non random values to demonstrate loading of historic values
        this.history = [{value: 10}, {value: 20}, {value: 30}, {value: 40}, {value: 50}]
    }

    getNewValues() {
        let newValue = {value: Math.ceil(Math.random() * 100)};
        this.history.push(newValue);
        return [newValue]
    }

    getPastValues(since) {
        return [...this.history];
    }


}
