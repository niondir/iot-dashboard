import * as React from 'react';
import {Component} from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {connect} from 'react-redux'
import {Provider} from 'react-redux'
import {CounterApp} from './exampleCounter'


export default class Layout extends Component {
	render() {
		return <div>
			<h1>Demo App</h1>
			<CounterApp/>
		</div>
	}
	
}