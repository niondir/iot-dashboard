/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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