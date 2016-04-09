import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {Provider} from 'react-redux'
import Layout from './layout'
import * as Counter from './exampleCounter'
import * as Grid from './widgetGrid'
import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/semantic';
import createLogger from 'redux-logger';
import * as Widgets from './widgets/widgets'
import * as WidgetConfig from './widgets/widgetConfig'
import thunk from 'redux-thunk'

Widgets.init();

let reducer = Redux.combineReducers({
    counter: Counter.reducer,
    widgets: Widgets.widgets
});

const logger = createLogger();
let store = Redux.createStore(
    reducer,
    Redux.applyMiddleware(
        thunk,
        logger // must be last
    ));

console.log(store.getState());

ReactDOM.render(
    <Provider store={store}>
        <Layout/>
    </Provider>,
    document.getElementById('app'));
