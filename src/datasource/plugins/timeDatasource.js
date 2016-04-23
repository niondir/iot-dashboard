import {assert} from 'chai'

export const TYPE_INFO = {
    type: "time",
    name: "Time"
};


export class Datasource {

    constructor() {
        
    }

    renderTime() {
        const currentTime = new Date();
        let diem = 'AM';
        let h = currentTime.getHours();
        let m = currentTime.getMinutes();
        let s = currentTime.getSeconds();

        if (h === 0) {
            h = 12;
        } else if (h > 12) {
            h = h - 12;
            diem = 'PM';
        }

        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }
        return {
            hours: h,
            minutes: m,
            seconds: s,
            diem
        };
    };

    getNewValues() {
        const now = new Date();
        return [{date: now}]
    }

}
