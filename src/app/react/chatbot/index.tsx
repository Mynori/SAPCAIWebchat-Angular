import * as React from 'react'
import { Provider } from 'react-redux'
import { store } from './store'

import App from './containers/App'
import IPreferences from './types/IPreferences'

// https://github.com/babel/babel-loader/issues/401
// if (!global._babelPolyfill) {
//   require('@babel/polyfill')
// }

type Props = {
  token: string,
  channelId: string,
  readOnlyMode: boolean,
  preferences: IPreferences
}

export default class CaiWebchat extends React.Component<Props> {
  render () {
    return (
      <Provider store={store}>
        <App {...this.props} />
      </Provider>
    )
  }
}
