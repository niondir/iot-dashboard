import {assert} from 'chai'

export const TYPE_INFO = {
    type: "time",
    name: "Time",
    settings: {
        format: {
            name: 'Time Format',
            type: 'string',
            "defaultValue": "HH:MM:SS",
            "description": "Uhm like for moment JS?"
        }
    }
    ,
    defaultProps: {}
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
