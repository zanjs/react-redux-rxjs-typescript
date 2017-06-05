import * as React from 'react';
import { Route } from 'react-router-dom';

import { Layout } from './components/Layout';

import Home from './views/Home'
import Ajax from './views/Ajax';
import Websocket from './views/Websocket'

export const routes =
    <Layout>
        <Route exact path='/' component={ Home } />
        <Route path='/ajax/:userName?' component={ Ajax } />
        <Route path='/websocket/' component={Websocket} />
    </Layout>;
