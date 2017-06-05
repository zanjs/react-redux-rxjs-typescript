import { combineEpics } from 'redux-observable'
import * as Ajax from './Ajax';
import * as WebSocket from './Websocket'

// The top-level state object
export interface ApplicationState {
    ajax: Ajax.AjaxState,
    websocket: WebSocket.WebsocketState
}

export const epics = combineEpics(Ajax.userEpic, WebSocket.connectionEpic, WebSocket.connectedEpic, WebSocket.messageEpic);

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    ajax: Ajax.reducer,
    websocket: WebSocket.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
