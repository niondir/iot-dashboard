import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {connect} from 'react-redux'
import {Provider} from 'react-redux'

const initialState = {
    counter: 1
};

function incCounter(amount) {
    return {
        type: "INC_COUNTER",
        amount: amount
    }
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case "INC_COUNTER":
            return {
                ...state,
                counter: state.counter += action.amount
            };
        default:
            return state;
    }
}


class App extends React.Component {
    render() {
        return <div>
            <h1>Demo App</h1>

            <a onClick={() => this.props.clickLink(3)}>Click me</a>: <span>{this.props.value}</span>
        </div>;

    }
}

const mapStateToProps = (state) => {
    return {
        value: state.counter
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        clickLink: (amount) => {
            dispatch(incCounter(amount))
        }
    }
}

const CounterApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

let store = Redux.createStore(appReducer, undefined);

ReactDOM.render(
    <Provider store={store}>
        <CounterApp/>
    </Provider>,
    document.getElementById('app'));