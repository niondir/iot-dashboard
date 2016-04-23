import {assert} from 'chai'

export const TYPE_INFO = {
    type: "time",
    name: "Time"
};


export class Datasource {

    constructor() {
        
    }

    getNewValues() {
        return [{date: new Date()}]
    }

}
