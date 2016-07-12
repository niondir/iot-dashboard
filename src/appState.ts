import * as Redux from 'redux'
import * as Widgets from './widgets/widgets'

export type Dispatch = Redux.Dispatch<State>
export type GetState = () => State
export type Action = Redux.ThunkAction<any, State, any> | Redux.Action
export type Reducer = Redux.Reducer<State>


export interface State {
    widgets: Widgets.IWidgetsState
}

export default State;