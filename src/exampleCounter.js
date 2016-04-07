import * as React from 'react';
import {Component} from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {connect} from 'react-redux'


const initialState = {
	value: 2
};

function incCounter(amount) {
	return {
		type: "INC_COUNTER",
		amount: amount
	}
}


export function reducer(state = initialState, action) {
	switch (action.type) {
		case "INC_COUNTER":
			return {
				...state,
				value: state.value += action.amount
			};
		default:
			return state;
	}
}

class Counter extends Component {
	render() {
		return <div>
			<a onClick={() => this.props.clickLink(3)}>Click me</a>: <span>{this.props.value}</span>
		</div>;

	}
}


const mapStateToProps = (state) => {
	return {
		value: state.counter.value
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		clickLink: (amount) => {
			dispatch(incCounter(amount))
		}
	}
};

export const CounterApp = connect(
	mapStateToProps,
	mapDispatchToProps
)(Counter);
