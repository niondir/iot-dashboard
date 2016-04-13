import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {Provider} from 'react-redux'
import Layout from './pageLayout'
import * as Persist from './widgets/persistence'
// Css
import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/semantic';
// Redux Middleware
import createLogger from 'redux-logger';
import thunk from 'redux-thunk'
// Reducers
import * as Widgets from './widgets/widgets'
import * as Counter from './exampleCounter'
import * as WidgetTypes from './widgets/widgetTypes'
import * as WidgetConfig from './widgets/widgetConfig'
import * as Layouts from './layouts/layouts'
// Widgets
import * as TimeWidget from './widgets/timeWidget'
import * as TextWidget from './widgets/textWidget'



Widgets.register(TimeWidget);
Widgets.register(TextWidget);


let reducer = Redux.combineReducers({
    counter: Counter.reducer,
    widgets: Widgets.widgets,
    widgetTypes: WidgetTypes.widgetTypes, //TODO: Unused?
    widgetConfig: WidgetConfig.widgetConfigDialog,
    layouts: Layouts.layouts
});

const logger = createLogger();
let store = Redux.createStore(
    reducer,
    Persist.loadFromLocalStorage(),
    Redux.applyMiddleware(
        thunk,
        Persist.persistenceMiddleware,
        logger // must be last
    ));

ReactDOM.render(
    <Provider store={store}>
        <Layout/>
    </Provider>,
    document.getElementById('app'));
