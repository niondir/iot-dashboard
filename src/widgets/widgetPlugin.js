import {connect} from 'react-redux'
import React from 'react'
import * as _ from 'lodash'
import {PropTypes as Prop}  from "react";

// TODO: Rename to ...Factory
export default class WidgetPlugin {
    constructor(module, store) {
        console.assert(module.TYPE_INFO, "Missing TYPE_INFO on widget module. Every module must export TYPE_INFO");
        this._type = module.TYPE_INFO.type;
        this.Widget = module.Widget;
        this.store = store;
        this.instances = {};
    }

    get type() {
        return this._type;
    }

    getOrCreateInstance(id) {
        if (this.instances[id]) {
            return this.instances[id];
        }

        // TODO: check if module.Widget is a react component
        var widgetPlugin = this.store.getState().widgetPlugins[this.type];
        const rendering = widgetPlugin.typeInfo.rendering || "react";

        let widgetComponent = this.Widget;
        if (rendering === "dom") {
            widgetComponent = DomWidgetContainer;
        }


        const widget = connect(state => {
                let getData = function (dsId) {
                    // TODO: the Dataasource is held by refference that can be bad!
                    const ds = state.datasources[dsId];
                    if (!ds) {
                        return [];
                    }
                    return ds.data || [];
                };

                // This method will be used as mapStateToProps, leading to a constant "getData()" function per instance
                // Therefor the update is only called when actual state changes
                return (state) => {
                    const widgetState = state.widgets[id];
                    return {
                        config: widgetState.props,
                        _state: widgetState,
                        _datasources: state.datasources,
                        getData: getData
                    }
                };
            }
        )(widgetComponent);

        this.instances[id] = React.createElement(widget, {_widgetClass: this.Widget});
        // Should we create here or always outside?
        return this.instances[id];
    }
}

class DomWidgetContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            widget: new props._widgetClass(props)
        };
    }

    componentWillMount() {
        if (this.state.widget.componentWillMount) {
            this.state.widget.componentWillMount();
        }
    }

    componentDidMount() {
        this.state.widget.render(this.props, this.refs.container);
        if (this.state.widget.componentDidMount) {
            this.state.widget.componentDidMount();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.widget.componentWillReceiveProps) {
            this.state.widget.componentWillReceiveProps(nextProps);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.widget.shouldComponentUpdate) {
            return this.state.widget.shouldComponentUpdate(nextProps, nextState);
        }
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.widget.componentWillUpdate) {
            this.state.widget.componentWillUpdate(nextProps, nextState);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.state.widget.render(this.props, this.refs.container);
        if (this.state.widget.componentDidUpdate) {
            this.state.widget.componentDidUpdate(prevProps, prevState);
        }
    }


    componentWillUnmount() {
        if (this.state.widget.componentWillUnmount) {
            this.state.widget.componentWillUnmount();
        }
    }

    render() {
        return <div ref="container">Widget Plugin missing rendering!</div>;
    }
}

DomWidgetContainer.propTypes = {
    _widgetClass: Prop.func.isRequired
};