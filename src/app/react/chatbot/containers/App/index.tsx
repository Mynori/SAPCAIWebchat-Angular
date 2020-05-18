import * as React from 'react'
import * as PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Chat from '../Chat'
import Expander from '../../components/Expander'
import { setFirstMessage, removeAllMessages } from '../../actions/messages'
import { setCredentials, createConversation } from '../../actions/conversation'
import { storeCredentialsToLocalStorage, getCredentialsFromLocalStorage } from '../../helpers'
import IPreferences from '../../types/IPreferences'


const NO_LOCALSTORAGE_MESSAGE
  = 'Sorry, your browser does not support web storage. Are you in localhost ?'

type Props = {
  token: string,
  channelId: string,
  preferences: IPreferences,
  containerMessagesStyle?: Object,
  expanderStyle?: Object,
  containerStyle?: Object,
  showInfo?: boolean,
  sendMessagePromise?: Function,
  conversationHistoryId?: string,
  loadConversationHistoryPromise?: Function,
  noCredentials?: boolean,
  primaryHeader?: Function,
  secondaryView?: boolean,
  secondaryHeader?: any,
  secondaryContent?: any,
  getLastMessage?: Function,
  expanded?: boolean,
  onToggle?: Function,
  removeAllMessages?: Function,
  onRef?: Function,
  clearMessagesOnclose?: boolean,
  enableHistoryInput?: boolean,
  readOnlyMode: boolean,
  defaultMessageDelay?: number,
  onClickShowInfo?: any,
  logoStyle?: any,
  setCredentials?: Function,
  setFirstMessage?: Function,
  createConversation?: Function
}

type State = {
  isReady: boolean,
  expanded: boolean
}

@connect(
  state => ({
    isReady: state.conversation.conversationId,
  }),
  {
    setCredentials,
    setFirstMessage,
    createConversation,
    removeAllMessages,
  },
)
class App extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      expanded: props.expanded || false,
      isReady: null,
    }
  }

  static getDerivedStateFromProps (props, state) {
    const { isReady, preferences, expanded } = props
    if (isReady !== state.isReady) {
      let expanded = null

      switch (preferences.openingType) {
      case 'always':
        expanded = true
        break
      case 'never':
        expanded = false
        break
      case 'memory':
        if (window.localStorage) {
          expanded = localStorage.getItem('isChatOpen') === 'true'
        } else {
          console.log(NO_LOCALSTORAGE_MESSAGE)
        }
        break
      default:
        break
      }
      return { expanded, isReady }
    }
    return null
  }

  componentDidMount () {
    const { channelId, token, preferences, noCredentials, onRef } = this.props
    const credentials = getCredentialsFromLocalStorage()
    const payload = { channelId, token }

    if (onRef) {
      onRef(this)
    }

    if (noCredentials) {
      return false
    }

    if (credentials) {
      Object.assign(payload, credentials)
    } else {
      this.props.createConversation(channelId, token).then(({ id, chatId }) => {
        storeCredentialsToLocalStorage(chatId, id, preferences.conversationTimeToLive)
      })
    }

    if (preferences.welcomeMessage) {
      this.props.setFirstMessage(preferences.welcomeMessage)
    }

    this.props.setCredentials(payload)
  }

  componentDidUpdate (prevProps, prevState) {
    const { onToggle, conversationHistoryId } = this.props

    if (prevState.expanded !== this.state.expanded) {
      if (window.localStorage) {
        localStorage.setItem('isChatOpen', String(this.state.expanded))
        if (onToggle) {
          onToggle(this.state.expanded)
        }
      } else {
        console.log(NO_LOCALSTORAGE_MESSAGE)
      }
    }
  }

  componentDidCatch (error, info) {
    console.log(error, info)
  }

  toggleChat = () => {
    const { clearMessagesOnclose } = this.props
    this.setState({ expanded: !this.state.expanded }, () => {
      if (!this.state.expanded && clearMessagesOnclose) {
        this.clearMessages()
      }
    })
  }

  clearMessages = () => {
    this.props.removeAllMessages()
  }

  render () {
    const {
      token,
      channelId,
      preferences,
      containerMessagesStyle,
      containerStyle,
      expanderStyle,
      logoStyle,
      showInfo,
      sendMessagePromise,
      loadConversationHistoryPromise,
      onClickShowInfo,
      conversationHistoryId,
      primaryHeader,
      secondaryView,
      secondaryHeader,
      secondaryContent,
      getLastMessage,
      enableHistoryInput,
      defaultMessageDelay,
      readOnlyMode,
    } = this.props;
    const { expanded } = this.state;

    return (
      <div className='RecastApp CaiApp'>
        <link
          rel='stylesheet'
          type='text/css'
          href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'
        />
        <link
          rel='stylesheet'
          type='text/css'
          href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'
        />

        <Expander
          show={!expanded}
          onClick={this.toggleChat}
          preferences={preferences}
          style={expanderStyle}
        />

        <Chat
          token={token}
          channelId={channelId}
          show={expanded}
          closeWebchat={this.toggleChat}
          preferences={preferences}
          containerMessagesStyle={containerMessagesStyle}
          containerStyle={containerStyle}
          logoStyle={logoStyle}
          showInfo={showInfo}
          onClickShowInfo={onClickShowInfo}
          sendMessagePromise={sendMessagePromise}
          loadConversationHistoryPromise={loadConversationHistoryPromise}
          primaryHeader={primaryHeader}
          secondaryView={secondaryView}
          secondaryHeader={secondaryHeader}
          secondaryContent={secondaryContent}
          getLastMessage={getLastMessage}
          enableHistoryInput={enableHistoryInput}
          defaultMessageDelay={defaultMessageDelay}
          conversationHistoryId={conversationHistoryId}
          readOnlyMode={readOnlyMode}

        />
      </div>
    );
  }
}

export default App
