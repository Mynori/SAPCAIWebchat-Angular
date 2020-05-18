import 'regenerator-runtime/runtime';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { store } from './chatbot/store';
import { Provider } from 'react-redux';
import { getChannelPreferences } from './chatbot/actions/channel';
import App from './chatbot/containers/App';
import IPreferences from './chatbot/types/IPreferences'

const channelId = "c81fb1ea-b971-4d07-b000-41f3fb7308ab";
const token = "b494f3c421ea841deab2819f0eaeffc6";
const readOnly = false;

export class ReactApplication {

    static initialize(
        container: HTMLElement
    ) {
        getChannelPreferences(channelId, token).then((preferences: IPreferences) => {
            ReactDOM.render(
                <Provider store={store}>
                    <App
                        token={token}
                        channelId={channelId}
                        preferences={preferences}
                        readOnlyMode={readOnly} />
                </Provider>,      
                container,
            )
        })
    }
}