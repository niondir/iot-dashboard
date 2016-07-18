import {renderToString} from 'react-dom/server'
import {Provider} from 'react-redux'
import Layout from './pageLayout'
import * as React from 'react' //TSC needs a reference to react
import * as Store from './store'

// Render the component as string
export function render(store: Store.DashboardStore) {
	return renderToString(
		<Provider store={store}>
			<Layout/>
		</Provider>
	)
}