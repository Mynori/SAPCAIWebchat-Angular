import * as React from 'react'
import * as PropTypes from 'prop-types'
import cx from 'classnames'
import contains from 'ramda/es/contains'

import Text from './Text'
import Card from './Card'
import List from './List'
import Buttons from './Buttons'
import Picture from './Picture'
import Carousel from './Carousel'
import QuickReplies from './QuickReplies'

import './style.scss'
import IPreferences from '../../types/IPreferences'

interface Props {
  key,
  message: {
    displayIcon
    participant: {
      isBot: boolean
    }
    attachment: {
      type
      content: {
        title: string
        subtitle: string
        imageUrl: string
        buttons: HTMLElement[]
      }
      error
      title: string
      markdown
    }
  },
  sendMessage: (...args: any[]) => any,
  preferences: IPreferences,
  isLastMessage: boolean,
  onImageLoaded: (...args: any[]) => any,
  retry: boolean,
  isSending: boolean,
  onRetrySendMessage: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void,
  onCancelSendMessage: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void,
  showInfo: boolean,
  onClickShowInfo: Function,
  error: boolean
}

class Message extends React.Component<Props> {
  render () {
    const {
      message,
      isLastMessage,
      sendMessage,
      preferences,
      onImageLoaded,
      retry,
      isSending,
      onRetrySendMessage,
      onCancelSendMessage,
      showInfo,
      onClickShowInfo,
    } = this.props
    const {
      botPicture,
      userPicture,
      accentColor,
      complementaryColor,
      botMessageColor,
      botMessageBackgroundColor,
    } = preferences
    const { displayIcon } = message
    const { type, content, error, title, markdown } = message.attachment
    const isBot = message.participant.isBot

    const image = isBot ? botPicture : userPicture
    const messageProps: { isBot: boolean, content: string | object, isMarkdown: boolean, onImageLoaded: (...args: any[]) => any, style: any } = {
      isBot,
      // Make sure we display the title of a button/quickReply click, and not its value
      content: content || title,
      isMarkdown: markdown,
      onImageLoaded,
      style: {
        color: isBot ? (error ? '#fff' : botMessageColor) : complementaryColor,
        backgroundColor: isBot ? (error ? '#f44336' : botMessageBackgroundColor) : accentColor,
        opacity: retry || isSending ? 0.5 : 1,
        accentColor,
      },
    }
    if (!showInfo && type === 'client_data') {
      return null // ignore type client_data
    }
    /*
        {contains(type, ['carousel', 'carouselle']) (
          <Carousel {...messageProps} sendMessage={sendMessage} />
        )}
     *  between card and list
     */
    return (
      <div
        className={cx('RecastAppMessageContainer CaiAppMessageContainer', {
          bot: isBot,
          user: !isBot,
        })}
      >
        <div className={cx('RecastAppMessage CaiAppMessage', { bot: isBot, user: !isBot })}>
          {image && (
            <img
              className={cx('RecastAppMessage--logo CaiAppMessage--logo', { visible: displayIcon })}
              src={image}
              style={{}}
            />
          )}

          {type === 'text' && <Text {...messageProps} />}

          {type === 'picture' && <Picture {...messageProps} />}

          {type === 'card' && <Card {...messageProps} sendMessage={sendMessage} />}


          {type === 'list' && <List {...messageProps} sendMessage={sendMessage} />}

          {type === 'buttons' && <Buttons {...messageProps} sendMessage={sendMessage} />}

          {type === 'quickReplies' && (
            <QuickReplies
              {...messageProps}
              sendMessage={sendMessage}
              isLastMessage={isLastMessage}
            />
          )}
          {isBot && showInfo && type === 'client_data' && (
            <div className={cx('RecastAppMessage--retry CaiAppMessage--retry', { bot: isBot })}>
              Custom JSON message type. Not visible in channels.
            </div>
          )}
          {isBot && showInfo && (
            <div
              className='RecastAppMessage--JsonButton CaiAppMessage--JsonButton'
              onClick={() => {
                if (onClickShowInfo) {
                  onClickShowInfo(message)
                }
              }}
            >
              <img src='https://cdn.cai.tools.sap/website/bot-builder/info.png' />
            </div>
          )}
        </div>
        {retry && (
          <div className={cx('RecastAppMessage--retry CaiAppMessage--retry', { bot: isBot })}>
            Couldn’t send this message{' '}
            <span onClick={onRetrySendMessage} className='button'>
              Try again
            </span>{' '}
            |{' '}
            <span onClick={onCancelSendMessage} className='button'>
              Cancel
            </span>
          </div>
        )}
      </div>
    )
  }
}

export default Message
