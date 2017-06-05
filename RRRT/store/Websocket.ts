import { Action, Reducer, ActionCreator } from 'redux';
import { Observable, Subject } from 'rxjs'
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject'
import "rxjs/add/observable/dom/webSocket"
import "rxjs/add/operator/map"
import "rxjs/add/operator/switchMap"
import "rxjs/add/operator/takeUntil"
import "rxjs/add/operator/retryWhen"


// State

export interface WebsocketState {
    connecting: boolean;
    connected: boolean;
    socket: WebSocketSubject<string>;
    sentMessage: string;
    messageSent: boolean;
    receivedMessages: string[];
}

const defaultWebsocketState: WebsocketState = {
    connecting: false,
    connected: false,
    socket: null,
    sentMessage: "",
    messageSent: false,
    receivedMessages: []
}


// ----------------- //
// Actions

const CONNECT = 'CONNECT';
interface ConnectAction {
    type: 'CONNECT';
    payload: string;
}

const CONNECTED = 'CONNECTED';
interface ConnectedAction {
    type: 'CONNECTED';
    payload: WebSocketSubject<string>;
}

const DISCONNECT = 'DISCONNECT';
interface DisconnectAction {
    type: 'DISCONNECT';
    payload: WebSocketSubject<string>;
}

const SEND_MESSAGE = 'SEND_MESSAGE';
interface SendMessageAction {
    type: 'SEND_MESSAGE';
    payload: string;
}

const MESSAGE_SENT = 'MESSAGE_SENT';
interface MessageSentAction {
    type: 'MESSAGE_SENT';
}

const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
interface ReceiveMessageAction {
    type: 'RECEIVE_MESSAGE';
    payload: any;
}

// This 'discriminated union' type, guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = ConnectAction | ConnectedAction | DisconnectAction | SendMessageAction | MessageSentAction | ReceiveMessageAction;


// ----------------- //
// Action Creators

export const actionCreators = {
    Connect: (url: string) => <ConnectAction>{ type: CONNECT, payload: url },
    Connected: (socket: WebSocketSubject<string>) => <ConnectedAction>{ type: CONNECTED, payload: socket },
    Disconnect: () => <DisconnectAction>{ type: DISCONNECT },
    SendMessage: (message: string) => <SendMessageAction>{ type: SEND_MESSAGE, payload: message },
    MessageSent: () => <MessageSentAction>{type: MESSAGE_SENT },
    ReceiveMessage: (message: any) => <ReceiveMessageAction>{ type: RECEIVE_MESSAGE, payload: message }
    
};


// ----------------- //
// Epics

export const connectionEpic = (action$, store) =>
    action$.ofType(CONNECT)
        .map(action => actionCreators.Connected(new WebSocketSubject(action.payload)));

export const connectedEpic = (action$, store) =>
    action$.ofType(CONNECTED)
        .switchMap(action =>
            action.payload
                .retryWhen(error =>
                    window.navigator.onLine ? Observable.timer(1000) : Observable.fromEvent(window, 'onLine')
                )
                .takeUntil(action$.ofType(DISCONNECT))
                .map(data => actionCreators.ReceiveMessage(data))
        );

export const messageEpic = (action$, store) =>
    action$.ofType(SEND_MESSAGE)
        .map(action => {
            store.getState().websocket.socket.next(JSON.stringify(action.payload));
            return actionCreators.MessageSent();
        });


// ----------------- //
// Reducer

export const reducer: Reducer<WebsocketState> = (state: WebsocketState, action: KnownAction) => {
    switch (action.type) {
        case CONNECT:
            return { ...state, connecting: true, connected: false }
        case CONNECTED:
            return { ...state, connecting: false, conntected: true, socket: action.payload }
        case DISCONNECT:
            return { ...state, connected: false, socket: null, sentMessage: "", messageSent: false, receivedMessages: []}
        case SEND_MESSAGE:
            return { ...state, sentMessage: action.payload, messageSent: false };
        case MESSAGE_SENT:
            return { ...state, messageSent: true}
        case RECEIVE_MESSAGE:
            let messages = state.receivedMessages.slice(0); // Clone array
            messages.push(action.payload);
            return { ...state, receivedMessages: messages };
        default:
            // The following line will produce a compiler error (highlighted in the IDE) 
            // if not all actions in KnowAction (and only those) are covered
            const exhaustiveCheck: never = action;
    }

    return state || defaultWebsocketState;
};
