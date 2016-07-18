import * as Redux from 'redux'
import * as Widgets from './widgets/widgets'
import * as Config from './config'

export type Dispatch = Redux.Dispatch<State>
export type GetState = () => State
export type ThunkAction = Redux.ThunkAction<any, State, any>
export type Action = ThunkAction | Redux.Action
export type Reducer = Redux.Reducer<State>

export interface State {
    config: Config.IConfigState
    widgets: Widgets.IWidgetsState
}

export default State;