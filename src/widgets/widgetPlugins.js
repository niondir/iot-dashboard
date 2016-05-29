import {connect} from 'react-redux'
import React from 'react'

// state is bound, widgets will only have to provide the dsId which the user configures
function dataResolver(store, dsId) {
    const state = store.getState ? store.getState() : store; // little hack for testng
    const ds = state.datasources[dsId];
    if (!ds) {
        //console.warn("Can not find Datasource with id " + id + " for widget: ", widgetState, " Returning empty data!");
        return [];
    }

    return ds.data ? [...ds.data] : [];
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

class PluginRegistry {

    constructor() {
        this.widgets = {};
        this.instances = {};
    }

    set store(store) {
        this._store = store;
        this.dataResolver = dataResolver.bind(this, store)
    }

    getOrCreateWidget(module, id) {
        if (this.instances[id]) {
            return this.instances[id];
        }

        // TODO: check if module.Widget is a react component
        const rendering = module.TYPE_INFO.rendering || "react";

        let widgetComponent = module.Widget;
        if (rendering === "dom") {
            widgetComponent = DomWidgetContainer;
        }


        const widget = connect(state => {
                const widgetState = state.widgets[id];

                return {
                    config: widgetState.props,
                    _state: widgetState,
                    // It is important that the dataResolver does not change, else the component gets updates all the time
                    //getData: this.dataResolver
                    getData: dataResolver.bind(this, state)
                }
            }
        )(widgetComponent);

        this.instances[id] = React.createElement(widget, {_widgetClass: module.Widget});
        // Should we create here or always outside?
        return this.instances[id];
    }

    register(module) {
        console.assert(module.TYPE_INFO, "Missing TYPE_INFO on widget module. Every module must export TYPE_INFO");


        this.widgets[module.TYPE_INFO.type] = {
            ...module.TYPE_INFO,
            getOrCreateWidget: this.getOrCreateWidget.bind(this, module)
            //Widget: moduleWidget
        }
    }

    getPlugin(type:String) {
        return this.widgets[type];
    }

    getPlugins():Array {
        return Object.keys(this.widgets).map(key => this.widgets[key]);
    }
}

const WidgetPlugins = new PluginRegistry();
export default WidgetPlugins;

