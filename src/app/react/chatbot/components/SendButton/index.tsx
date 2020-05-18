import * as React from 'react'
import * as PropTypes from 'prop-types'

import IPreferences from '../../types/IPreferences'

const SendButton = ({ sendMessage, preferences, value }: { sendMessage, preferences: IPreferences, value }) => (
  <div
    className='RecastSendButtonContainer CaiSendButtonContainer'
  >
    { value && 
    <div
      className='RecastSendButton CaiSendButton'
      onClick={sendMessage}
    >
      <svg
        style={{
          width: 23,
          fill: value ? preferences.accentColor : preferences.botMessageColor,
        }}
        viewBox='0 0 512 512'
      >
        <path d='M85 277.375h259.704L225.002 397.077 256 427l171-171L256 85l-29.922 29.924 118.626 119.701H85v42.75z' />
      </svg>
    </div>
    }
  </div>
)

SendButton.propTypes = {
  preferences: PropTypes.object,
  sendMessage: PropTypes.func,
  value: PropTypes.string,
}

export default SendButton
