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

export function getWidget(type:String) {
    return widgets[type];
}

export function getWidgets():Array {
    return Object.keys(widgets).map(key => widgets[key]);
}