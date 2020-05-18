import * as React from 'react'
import * as PropTypes from 'prop-types'
import { sanitizeUrl } from '@braintree/sanitize-url'

import './style.scss'

interface Props {
  callAfterTimeout: Function
  timeout: number
  image: string
}

class IsTyping extends React.Component<Props> {
  componentDidMount () {
    const { callAfterTimeout, timeout } = this.props
    setTimeout(callAfterTimeout, timeout)
  }

  render () {
    const { image } = this.props

    if (image && sanitizeUrl(image) === 'about:blank') {
      return null
    }

    return (
      <div className='RecastAppMessage CaiAppMessage bot'>
        {image && <img className='RecastAppMessage--logo CaiAppMessage--logo visible' src={image} />}
        <img src='https://cdn.cai.tools.sap/webchat/istyping.gif' />
      </div>
    )
  }
}

export default IsTyping
