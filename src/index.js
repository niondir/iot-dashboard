import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {connect} from 'react-redux'
import {Provider} from 'react-redux'


function incCounter(amount) {
    return {
        type: "INC_COUNTER",
        amount: amount
    }
}

const initialState = {
    counter: 1
};

function counterApp(state = initialState, action) {
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

let store = Redux.createStore(counterApp, undefined);


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

class App extends React.Component {
    clickLink() {
        store.dispatch(incCounter(3));
    }


    render() {
        return <div>
            <h1>Demo App</h1>

            <a onClick={() => this.props.clickLink(3)}>Click me</a>: <span>{this.props.value}</span>
        </div>;

    }
}

const CounterApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

ReactDOM.render(
    <Provider store={store}>
        <CounterApp/>
    </Provider>,
    document.getElementById('app'));