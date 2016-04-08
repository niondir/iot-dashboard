import {TimeWidget} from './timeWidget'
import {TextWidget} from './textWidget'


let widgets = {};


export function init() {
   register("time", TimeWidget); 
   register("text", TextWidget); 
}

export function register(name:String, component) {
    widgets[name] = {component: component};
}

export function getWidget(name: String) {
    return widgets[name];
}