import * as React from 'react'
import * as PropTypes from 'prop-types'
import cx from 'classnames'
import IPreferences from '../../types/IPreferences'

const Expander = ({ onClick, preferences, style, show }: {onClick: any, preferences: IPreferences, style: any, show: any}) => (
  <div
    onClick={onClick}
    className={cx('RecastAppExpander CaiAppExpander', { open: show, close: !show })}
    style={{
      color: preferences.complementaryColor,
      backgroundColor: preferences.accentColor,
      ...style,
    }}
  >
    {preferences.expanderLogo && (
      <img className='RecastAppExpander--logo CaiAppExpander--logo' src={preferences.expanderLogo} />
    )}

    {preferences.expanderTitle}

    {preferences.onboardingMessage && (
      <div className='RecastAppExpander--onboarding CaiAppExpander--onboarding'>{preferences.onboardingMessage}</div>
    )}
  </div>
)

Expander.propTypes = {
  preferences: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  show: PropTypes.bool,
}

export default Expander
