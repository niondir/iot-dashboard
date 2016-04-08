import * as React from 'react';
import * as TimeWidget from './timeWidget'
import * as TextWidget from './textWidget'


let widgets = {};


export function init() {
    register(TimeWidget);
    register(TextWidget);
}

export function register(module) {
    widgets[module.TYPE] = {
        widget: module.Widget,
        configDialog: module.ConfigDialog
    };
}

export function getWidget(name:String) {
    return widgets[name];
}