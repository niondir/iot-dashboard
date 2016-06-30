import { renderToString } from 'react-dom/server'
import {Provider} from 'react-redux'
import Layout from './pageLayout'
//TODO: JSX assumes React to be avaliable globally, we should tell this Webpack
//import React from 'react'
import store from './store'


// Render the component to a string
export const html = renderToString(
    <Provider store={store}>
        <Layout/>
    </Provider>
);

// Grab the initial state from our Redux store
export const state = store.getState();