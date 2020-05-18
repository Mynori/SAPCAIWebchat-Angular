import * as React from 'react'
import * as PropTypes from 'prop-types'

import Button from '../Button'

import { truncate } from '../../helpers'

import './style.scss'

const Buttons = ({ content, sendMessage, style }) => {
  const { title, buttons } = content
  return (
    <div className='Buttons'>
      <p className='Buttons--title' style={style}>
        {truncate(title, 640)}
      </p>

      <div className='Buttons--container'>
        {buttons.slice(0, 3).map((b, i) => (
          <Button key={i} button={b} sendMessage={sendMessage} />
        ))}
      </div>
    </div>
  )
}

Buttons.propTypes = {
  style: PropTypes.object,
  content: PropTypes.any,
  sendMessage: PropTypes.func,
}

export default Buttons
