import * as React from 'react'
import ModalDialog from "../modal/modalDialog.ui.js";
import * as WidgetPlugins from "./widgetPlugins";
import * as WidgetConfig from "./widgetConfig";
import {connect} from "react-redux";
import SettingsForm from "../ui/settingsForm.ui";
import {reset} from "redux-form";
import * as ModalIds from '../modal/modalDialogIds'
import {PropTypes as Prop}  from "react";

const DIALOG_ID = ModalIds.WIDGET_CONFIG;
const FORM_ID = "widget-settings-form";

export function unshiftIfNotExists(array, element, isEqual = (a, b) => a.id == b.id) {
    if (array.find((e) => isEqual(e, element)) == undefined) {
        array.unshift(element);
    }
}

class WidgetConfigModal extends React.Component {

    constructor(props) {
        super(props);
    }

    onSubmit(formData, dispatch) {
        dispatch(WidgetConfig.createOrUpdateWidget(this.props.widgetId, this.props.widgetType, formData));
        return true;
    }

    resetForm() {
        this.props.resetForm(FORM_ID);
    }

    render() {
        const props = this.props;
        const actions = [
            {
                className: "ui right button",
                label: "Reset",
                onClick: () => {
                    this.resetForm();
                    return false;
                }
            },
            {
                className: "ui right red button",
                label: "Cancel",
                onClick: () => {
                    this.resetForm();
                    return true;
                }
            },
            {
                className: "ui right labeled icon positive button",
                iconClass: "save icon",
                label: "Save",
                onClick: () => {
                    const success = this.refs.form.submit();
                    if (success) this.resetForm();
                    return success;
                }
            }
        ];

        //const selectedWidgetPlugin = WidgetPlugins.getPlugin(this.props.widgetType) || {settings: []};
        const selectedWidgetPlugin = props.widgetPlugin;

        // TODO: Get typeInfo from selectedWidgetPlugin.typeInfo
        if (!selectedWidgetPlugin) {
            // TODO: Find a better (more generic way) to deal with uninitialized data for modals
            // TODO: The widgetConfig in the state is a bad idea. Solve this via state.modalDialog.data
            // This is needed for the very first time the page is rendered and the selected widget type is undefined
            return <ModalDialog id={DIALOG_ID}
                                title={"Configure "+ props.widgetType +" Widget"}
                                actions={actions}
            >
                <div>Unknown WidgetType: {props.widgetType}</div>
            </ModalDialog>
        }


        // Add additional fields
        const settings = selectedWidgetPlugin ? [...selectedWidgetPlugin.typeInfo.settings] : [];

        unshiftIfNotExists(settings, {
            id: 'name',
            name: 'Name',
            type: 'string',
            defaultValue: ""
        });

        const fields = settings.map(setting => setting.id);
        let initialValues = settings.reduce((initialValues, setting) => {
            if (setting.defaultValue !== undefined) {
                initialValues[setting.id] = setting.defaultValue;
            }
            return initialValues;
        }, {});
        // Overwrite with current widget props
        initialValues = Object.assign({}, initialValues, props.widgetSettings);

        return <ModalDialog id={DIALOG_ID}
                            title={"Configure "+ props.widgetType +" Widget"}
                            actions={actions}
        >
            <div className="ui one column grid">
                <div className="column">
                    {selectedWidgetPlugin.description ?

                        <div className="ui icon message">
                            <i className="idea icon"/>
                            <div className="content">
                                {selectedWidgetPlugin.description}
                            </div>

                        </div>
                        : null
                    }
                    <SettingsForm ref="form"
                                  form={FORM_ID}
                                  settings={settings}
                                  onSubmit={this.onSubmit.bind(this)}
                                  fields={[...fields]}
                                  initialValues={initialValues}
                    />

                </div>
            </div>
        </ModalDialog>
    }
}

WidgetConfigModal.propTypes = {
    widgetId: Prop.string,
    resetForm: Prop.func.isRequired,  // reset
    widgetType: Prop.string,
    widgetSettings: Prop.object.isRequired,
    widgetPlugin: WidgetPlugins.widgetPluginType
};

export default connect(
    (state) => {
        return {
            widgetId: state.widgetConfig.id,
            widgetType: state.widgetConfig.type,
            widgetSettings: state.widgetConfig.settings,
            widgetPlugin: state.widgetPlugins[state.widgetConfig.type]
        }
    },
    (dispatch) => {
        return {
            resetForm: (id) => dispatch(reset(id))
        }
    }
)(WidgetConfigModal);