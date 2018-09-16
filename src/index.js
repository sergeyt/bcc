import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { DrizzleContext } from 'drizzle-react';
import { LoadingContainer } from 'drizzle-react-components';
import { Drizzle } from "drizzle";

import store from './store';
import drizzleOptions from './drizzleOptions';
import rootSaga from './saga';
import App from './App';

store.runSaga(rootSaga);

const drizzle = new Drizzle(drizzleOptions, store);

const Root = (
    <Provider store={store}>
        <DrizzleContext.Provider drizzle={drizzle}>
            <LoadingContainer>
                <App />
            </LoadingContainer>
        </DrizzleContext.Provider>
    </Provider>
);

render(Root, document.getElementById('root'));
