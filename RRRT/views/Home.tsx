import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux'


export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <h1>Home</h1>
            <hr />
            <p><strong>A template for building advanced web apps using React, Redux, RxJS, and Typescript</strong></p>
            <h3>Technologies:</h3>
            <ul>
                <li>React</li>
                <li>Redux</li>
                <li>RxJS (via Redux-Observable)</li>
                <li>React Router V4</li>
                <li>Boostrap</li>
                <li>Typescript</li>
                <li>Webpack</li>
            </ul>
            <h3>Features:</h3>
            <ul>
                <li>Ajax and websocket examples</li>
                <li>Hot module replacement for components, reducers, and epics</li>
                <li>Separate app and vendor webpack bundles</li>
            </ul>
            <h3>Credits:</h3>
            <ul>
                <li><a href="https://github.com/aspnet/JavaScriptServices/tree/dev/templates/ReactReduxSpa">ASP.Net Core SPA Services React-Redux Template</a></li>

            </ul>
        </div>;
    }
}


