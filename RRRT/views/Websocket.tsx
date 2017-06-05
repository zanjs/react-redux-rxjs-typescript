import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as WebsocketState from '../store/Websocket';

// At runtime, Redux will merge together...
type WebsocketProps =
    WebsocketState.WebsocketState        // state
    & typeof WebsocketState.actionCreators      // action creators
    & RouteComponentProps<{}>; // incoming routing parameters   

class Websocket extends React.Component<WebsocketProps, { message: string}> {
    componentWillMount() {
        this.props.Connect("ws://echo.websocket.org");
        this.state = {
            message: ""
        };
    }

    public render() {
        return <div>
            <div className="row">
                <div className="col-sm-6">
                    <h1>Websocket</h1>
                </div>
                <div className="col-sm-6" style={{ marginTop: 30 }}>
                    <input value={this.state.message} onChange={(e) => this.setState({ message: e.target.value })} />
                    <button onClick={() => this.props.SendMessage(this.state.message)}>Send</button>
                </div>
            </div>
            <hr />
            <ul>
                {this.props.receivedMessages.map((value, index) => <li key={index}>{value}</li>)}
            </ul>
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => state.websocket, // mapStateToProps: Selects which state properties are merged into the component's props
    WebsocketState.actionCreators                 // mapDispatchToProps: Selects which action creators are merged into the component's props
)(Websocket) as typeof Websocket;
