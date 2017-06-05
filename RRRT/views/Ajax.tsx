import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as AjaxState from '../store/Ajax';

// At runtime, Redux will merge together...
type AjaxProps =
    AjaxState.AjaxState        // state
    & typeof AjaxState.actionCreators      // action creators
    & RouteComponentProps<{ userName: string }>; // incoming routing parameters   

class Ajax extends React.Component<AjaxProps, {userName: string}> {
    componentWillMount() {
        this.props.FetchUser(this.props.match.params.userName);
        this.state = {
            userName: this.props.match.params.userName
        };
    }

    componentWillReceiveProps(nextProps: AjaxProps) {
        // This method runs when incoming props (e.g., route params) change
        let userName = this.props.match.params.userName;
        if (this.props.userName !== nextProps.match.params.userName) {
            this.props.FetchUser(userName);
        }
    }

    componentWillUnmount() {
        this.props.CancelFetchUser();
    }

    renderUser(user) {
        return <ul>
            <li><strong>Username: </strong>{user.login}</li>
            <li><strong>Type: </strong>{user.type}</li>
            <li><strong>URL: </strong>{user.url}</li>
            <li><strong>Public Repositories: </strong>{user.public_repos}</li>
            <li><strong>Public Gists: </strong>{user.public_gists}</li>
        </ul>
    }

    public render() {
        return <div>
            <div className="row">
                <div className="col-sm-6">
                    <h1>Ajax</h1>
                </div>
                <div className="col-sm-6" style={{ marginTop: 30 }}>
                    <input value={this.state.userName} onChange={(e) => this.setState({ userName: e.target.value })} />
                    <button onClick={() => this.props.history.push('/ajax/' + this.state.userName)}>Fetch</button>
                </div>
            </div>
            <hr />
            {this.props.error ? <h1 style={{ color: "red" }}>Error!</h1> : this.renderUser(this.props.user)}
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => state.ajax, // mapStateToProps: Selects which state properties are merged into the component's props
    AjaxState.actionCreators                 // mapDispatchToProps: Selects which action creators are merged into the component's props
)(Ajax) as typeof Ajax;
