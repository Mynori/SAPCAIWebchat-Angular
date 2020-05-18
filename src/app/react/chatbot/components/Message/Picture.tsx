import * as React from 'react'
import *as PropTypes from 'prop-types'
import { sanitizeUrl } from '@braintree/sanitize-url'


const Picture = ({ title, onImageLoaded }) => {
  if (title && sanitizeUrl(title) === 'about:blank') {
    return null
  }
  return <img onLoad={onImageLoaded} src={title} className={'RecastAppPicture CaiAppPicture'} />
}

Picture.propTypes = {
  title: PropTypes.any,
  onImageLoaded: PropTypes.func,
}

export default Picture
