import React from 'react';
import * as ui from './elements.ui'

export function Field(props) {
    return <div className="field">
        <label>{props.name}
            {props.description && props.type !== 'boolean' ?
                <ui.Icon type="help circle" data-content={props.description}/> : null}
        </label>
        <SettingsInput {...props}/>
    </div>
}


function SettingsInput(props) {
    switch (props.type) {
        case "text":
            return <textarea rows="3" name={props.id} placeholder={props.description} defaultValue={props.defaultValue} />;
        case "string":
            return <input name={props.id} placeholder={props.description} defaultValue={props.defaultValue} />;
        case "boolean":
            return <input name={props.id} type="checkbox" defaultValue={props.defaultValue}/>
            /*<div className="ui checkbox">
                <input type="checkbox" tabIndex="0" className="hidden"/>
                <label>{props.description}</label>
            </div>;*/
        case "option":
            return <select name={props.id} defaultValue={props.defaultValue} className="ui fluid dropdown">
                {props.options.map(option => {
                    return <option key={option.value} value={option.value}>{option.name}</option>
                })}
            </select>;
        default:
            console.error("Unknown type for settings field: " + props.type)
    }
}