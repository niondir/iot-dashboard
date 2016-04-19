import {assert} from 'chai'

export const TYPE_INFO = {
    type: "time",
    name: "Time"
};


export class Datasource {

    getNewValues() {
        return [{date: new Date()}]
    }

}
