import * as Widgets from './widgets/widgets'

export interface GetState {
    ():State
}

export interface Dispatch {
    (action:Action):State
}

export interface Action {
    type: string;
    [others: string]: any;
}

export interface State {
    widgets:Widgets.IWidgetsState
}

export default State;