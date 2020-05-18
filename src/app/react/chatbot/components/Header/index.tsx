import * as React from 'react'
import * as PropTypes from 'prop-types'

import IPreferences from '../../types/IPreferences'

const Header = ({ closeWebchat, preferences, logoStyle, readOnlyMode }: { closeWebchat, preferences: IPreferences, logoStyle, readOnlyMode }) => {
  if (readOnlyMode) {
    return null
  }
  return (
    <div
      className='RecastAppHeader CaiAppHeader'
      style={{
        color: preferences.complementaryColor,
        backgroundColor: preferences.accentColor,
      }}
    >
      <img className='RecastAppHeader--logo CaiAppHeader--logo' src={preferences.headerLogo} style={logoStyle} />

      <div className='RecastAppHeader--title CaiAppHeader--title'>{preferences.headerTitle}</div>

      <div className='RecastAppHeader--btn CaiAppHeader--btn' onClick={closeWebchat}>
        <img src='https://cdn.cai.tools.sap/webchat/close.svg' />
      </div>
    </div>
  )
}

Header.propTypes = {
  closeWebchat: PropTypes.func,
  preferences: PropTypes.object,
  logoStyle: PropTypes.object,
  readOnlyMode: PropTypes.bool,
}

export default Header
