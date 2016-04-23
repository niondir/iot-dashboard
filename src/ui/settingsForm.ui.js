import React from 'react';
import {connect} from 'react-redux'
import * as ui from './elements.ui'
import {reduxForm, reset} from 'redux-form';
import {chunk} from '../util/collection'
import {valuesOf} from '../util/collection'
const Prop = React.PropTypes;

class SettingsForm extends React.Component {

    componentDidMount() {
        this._initSemanticUi();
    }

    componentDidUpdate() {
        this._initSemanticUi();
    }

    _initSemanticUi() {
        $('.icon.help.circle')
            .popup({
                position: "top left",
                offset: -10
            });
        $('.ui.checkbox')
            .checkbox();
    }

    render() {
        const props = this.props;
        const fields = props.fields;

        return <form className="ui form">
            {
                chunk(this.props.settings, 2).map(chunk => {
                    return <div key={chunk[0].id} className="two fields">
                        {chunk.map(setting => {
                            return <Field key={setting.id} {...setting} field={fields[setting.id]}/>;
                        })}
                    </div>
                })
            }

        </form>
    }
}

SettingsForm.propTypes = {
    settings: Prop.arrayOf(Prop.shape({
            id: Prop.string.isRequired,
            type: Prop.string.isRequired,
            name: Prop.string.isRequired
        }
    )).isRequired
};

export default reduxForm({})(SettingsForm);

function Field(props) {
    return <div className="field">
        <label>{props.name}
            {props.description && props.type !== 'boolean' ?
                <ui.Icon type="help circle" data-content={props.description}/> : null}
        </label>
        <SettingsInput {...props} />
    </div>
}

Field.propTypes = {
    field: Prop.object.isRequired, // redux-form field info
    name: Prop.string.isRequired,
    type: Prop.string.isRequired,
    description: Prop.string
};


function SettingsInput(props) {
    switch (props.type) {
        case "text":
            return <textarea rows="3" placeholder={props.description} {...props.field}  />;
        case "string":
            return <input placeholder={props.description} {...props.field} />;
        case "number":
            return <input type="number" min={props.min} max={props.max}
                          placeholder={props.description} {...props.field} />;
        case "boolean":
            return <input type="checkbox" {...props.field} />;
        case "option":
            return <select className="ui fluid dropdown" {...props.field} >
                <option>{"Select " + props.name + " ..."}</option>
                {props.options.map(option => {
                    return <option key={option.value} value={option.value}>{option.name}</option>
                })}
            </select>;
        case "datasource":
            return <DatasourceInputContainer {...props}/>
        default:
            console.error("Unknown type for settings field: " + props.type);
            return <input placeholder={props.description} readonly value={"Unknown field type: " + props.type}/>;
    }
}

Field.propTypes = {
    field: Prop.object.isRequired, // redux-form field info
    description: Prop.string,
    min: Prop.number, // for number
    max: Prop.number, // for number
    options: Prop.arrayOf( // For option
        Prop.shape({
                value: Prop.string.isRequired
            }.isRequired
        ))
};

function DatasourceInput(props) {
    const datasources = props.datasources;

    return <select className="ui fluid dropdown" {...props.field} >
        <option>{"Select " + props.name + " ..."}</option>
        {valuesOf(datasources, "id").map(ds => {
            return <option key={ds.id} value={ds.id}>{ds.props.name + " (" + ds.type + ")"}</option>
        })}
    </select>;
}

DatasourceInput.propTypes = {
    datasources: Prop.object.isRequired
};


const DatasourceInputContainer = connect(
    (state) => {
        return {
            datasources: state.datasources
        }
    }
)(DatasourceInput);