import {renderToString} from 'react-dom/server'
import {Provider} from 'react-redux'
import Layout from './pageLayout.js'
//TODO: JSX assumes React to be avaliable globally, we should tell this Webpack
import * as React from 'react'
import * as Store from './store'

// Render the component as string
export function render(store: Store.DashboardStore) {
	return renderToString(
		<Provider store={store}>
			<Layout/>
		</Provider>
	)
}