import { Action, Reducer, ActionCreator } from 'redux';
import { Observable } from 'rxjs/Observable'
import "rxjs/add/observable/dom/ajax"
import "rxjs/add/operator/map"
import "rxjs/add/operator/switchMap"
import "rxjs/add/operator/takeUntil"
import "rxjs/add/operator/catch"

// ----------------- //
// State

export interface AjaxState {
    userName: string;
    user: any;
    error: boolean;
}
const defaultAjaxState: AjaxState = {
    userName: "",
    user: {},
    error: false
}


// ----------------- //
// Actions

const FETCH_USER = 'FETCH_USER';
interface FetchUserAction {
    type: 'FETCH_USER',
    payload: string;
}

const FETCH_USER_FULFILLED = 'FETCH_USER_FULFILLED';
interface FetchUserFulfilledAction {
    type: 'FETCH_USER_FULFILLED',
    payload: any;
}

const FETCH_USER_REJECTED = 'FETCH_USER_REJECTED';
interface FetchUserRejectedAction {
    type: 'FETCH_USER_REJECTED',
    payload: any;
}

const FETCH_USER_CANCELLED = 'FETCH_USER_CANCELLED';
interface FetchUserCancelledAction {
    type: 'FETCH_USER_CANCELLED',
    payload: any;
}

// This 'discriminated union' type, guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = FetchUserAction | FetchUserFulfilledAction | FetchUserRejectedAction | FetchUserCancelledAction;

// ----------------- //
// Action Creators

export const actionCreators = {
    FetchUser: (userName: string) => <FetchUserAction>{ type: FETCH_USER, payload: userName },
    CancelFetchUser: () => <FetchUserCancelledAction>{ type: FETCH_USER_CANCELLED },
    FetchUserFulfilled: (user: any) => <FetchUserFulfilledAction>{ type: FETCH_USER_FULFILLED, payload: user },
    FetchUserRejected: (error: any) => <FetchUserRejectedAction>{ type: FETCH_USER_REJECTED, payload: error },
};

// ----------------- //
// Epics

export const userEpic = (action$, store) =>
    action$.ofType(FETCH_USER)
        .switchMap(action =>
            Observable.ajax.getJSON(`https://api.github.com/users/${action.payload}`)
                .map(response => actionCreators.FetchUserFulfilled(response))
                .takeUntil(action$.ofType(FETCH_USER_CANCELLED))
                .catch(error => Observable.of({
                    type: FETCH_USER_REJECTED,
                    payload: error.xhr.response,
                    error: true
                }))
         );

// ----------------- //
// Reducer


export const reducer: Reducer<AjaxState> = (state: AjaxState, action: KnownAction) => {
    switch (action.type) {
        case FETCH_USER:
            return {...state, userName: action.payload, error: false };
        case FETCH_USER_FULFILLED:
            if (state.userName === (action.payload as any).login) {
                return { ...state, user: action.payload };
            }
            break;
        case FETCH_USER_REJECTED:
            return { ...state, user: action.payload, error: true };
        case FETCH_USER_CANCELLED:
            return { ...state };
        default:
            // The following line will produce a compiler error (highlighted in the IDE) 
            // if not all actions in KnowAction (and only those) are covered
            const exhaustiveCheck: never = action;
    }

    return state || defaultAjaxState;
};
