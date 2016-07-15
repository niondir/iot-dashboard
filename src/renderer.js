import * as ReactDOM from 'react-dom'
import {Provider} from "react-redux"
import Layout from "./pageLayout"

export function render(element, store) {
    ReactDOM.render(
        <Provider store={store}>
            <Layout/>
        </Provider>,
        element);
}