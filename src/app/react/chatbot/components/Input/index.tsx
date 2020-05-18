import * as React from 'react'
import * as PropTypes from 'prop-types'
import append from 'ramda/es/append'

import SendButton from '../SendButton'

import Menu from '../Menu'
import MenuSVG from '../svgs/menu'
import './style.scss'
import IPreferences from '../../types/IPreferences'

// Number of minimum char to display the char limit.
const NUMBER_BEFORE_LIMIT = 5

type Props = {
  isOpen: boolean,
  menu: object,
  onSubmit: (attachment: any, userMessage?: any) => void,
  onInputHeight: (o: number) => any,
  enableHistoryInput: boolean,
  characterLimit: number,
  inputPlaceholder: string,
  preferences: IPreferences
}

type State = {
  value: string
  previousValues: []
  historyValues: []
  indexHistory: number
  menuOpened: boolean
  isOpen: boolean
  hasFocus: boolean
  menuIndexes: Array<Object>
}

class Input extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      previousValues: [],
      historyValues: [],
      indexHistory: 0,
      menuOpened: false,
      isOpen: false,
      hasFocus: false,
      menuIndexes: [],
    }
  }

  inputContainer: HTMLDivElement = null
  _input

  static getDerivedStateFromProps (props, state) {
    if (!props.isOpen) {
      return { isOpen: props.isOpen, hasFocus: false }
    }
    return { isOpen: props.isOpen }
  }

  componentDidMount () {
    this._input.focus()
    this._input.value = ''

    this.onInputHeight()
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextState.value !== this.state.value
      || nextState.menuOpened !== this.state.menuOpened
      || nextState.menuIndexes.length !== this.state.menuIndexes.length
      || nextState.isOpen !== this.state.isOpen
    )
  }

  componentDidUpdate () {
    if (this.state.isOpen && !this.state.hasFocus) {
      this.setFocusState()
    }
    if (!this.state.value) {
      // Dirty fix textarea placeholder to reset style correctly
      setTimeout(() => {
        this._input.style.height = '18px'
        this._input.value = ''
        this.onInputHeight()
      }, 100)
    }

    this.onInputHeight()
  }

  setFocusState () {
    setTimeout(() => {
      this._input.focus()
      this.setState({ hasFocus: true })
    }, 100)
  }

  onInputChange = e => {
    e.persist()

    const { characterLimit } = this.props
    const { value } = e.target

    if (characterLimit && value.length > characterLimit) {
      return
    }

    this.setState((prevState: Readonly<State>) => {
      const newPreviousValues: any = [...prevState.previousValues]
      newPreviousValues[prevState.indexHistory] = value
      return {
        value: e.target.value,
        previousValues: newPreviousValues,
      }
    }, this.autoGrow)
  }

  onInputHeight = () => {
    const { onInputHeight } = this.props
    if (onInputHeight) {
      onInputHeight(this.inputContainer.clientHeight)
    }
  }

  sendMessage = () => {
    const content = this.state.value.trim()
    if (content) {
      this.props.onSubmit({
        type: 'text',
        content,
      })
      this.setState((prevState: Readonly<State>) => {
        const historyValues = append(content, prevState.historyValues)
        const previousValues = append('', historyValues)

        return {
          value: '',
          previousValues,
          historyValues,
          indexHistory: previousValues.length - 1,
        }
      })
    }
  }

  autoGrow = () => {
    this._input.style.height = '18px'
    this._input.style.height = `${this._input.scrollHeight}px`
  }

  handleKeyboard = keyName => {
    const { indexHistory, previousValues } = this.state
    if (keyName === 'ArrowUp') {
      if (indexHistory > -1) {
        this.setState(
          (prevState: Readonly<State>) => {
            const indexHistory = Math.max(prevState.indexHistory - 1, 0)
            return {
              indexHistory,
              value: prevState.previousValues[indexHistory],
            }
          },
          () => {
            // Trick to go to the end of the line when pressing ArrowUp key
            setTimeout(() => {
              this._input.selectionStart = this._input.value.length
              this._input.selectionEnd = this._input.value.length
            }, 10)
          },
        )
      }
    } else if (keyName === 'ArrowDown') {
      if (indexHistory < previousValues.length - 1) {
        this.setState((prevState: Readonly<State>)  => {
          const indexHistory = Math.min(
            prevState.indexHistory + 1,
            Math.max(prevState.previousValues.length - 1, 0),
          )
          return {
            indexHistory,
            value: prevState.previousValues[indexHistory],
          }
        })
      } else {
        this.setState({
          value: '',
        })
      }
    }
  }

  removeMenuIndex = () => {
    const { menuIndexes }: { menuIndexes: object[]} = this.state
    this.setState({ menuIndexes: menuIndexes.slice(0, -1) })
  }

  addMenuIndex = i => {
    const { menuIndexes } = this.state
    this.setState({ menuIndexes: [...menuIndexes, i] })
  }

  getCurrentMenu = () => {
    const { menuIndexes } = this.state

    return menuIndexes.reduce((acc: any, currentMenu: any, i: number) => currentMenu.call_to_actions[i], this.props.menu)
  }

  triggerMenu = (): any => {
    const { menuOpened } = this.state
    if (menuOpened) {
      return this.setState({ menuOpened: false, menuIndexes: [] })
    }
    return this.setState({ menuOpened: true })
  }

  render () {
    const { enableHistoryInput, characterLimit, menu, preferences, inputPlaceholder } = this.props
    const { value, menuOpened } = this.state

    const showLimitCharacter = characterLimit
      ? characterLimit - value.length <= NUMBER_BEFORE_LIMIT
      : null

    return (
      <div
        className='RecastAppInput CaiAppInput'
        ref={ref => {
          this.inputContainer = ref
        }}
      >
        {menu && <MenuSVG onClick={this.triggerMenu()} />}

        {menuOpened && (
          <Menu
            closeMenu={this.triggerMenu()}
            currentMenu={this.getCurrentMenu()}
            addMenuIndex={this.addMenuIndex}
            removeMenuIndex={this.removeMenuIndex}
            postbackClick={value => this.setState({ value }, this.sendMessage)}
          />
        )}

        <textarea
          ref={i => (this._input = i)}
          value={value}
          style={{
            width: '100%',
            maxHeight: 70,
            resize: 'none',
          }}
          placeholder={inputPlaceholder}
          onChange={this.onInputChange}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              this.sendMessage()
              e.preventDefault()
            }
          }}
          onKeyDown={event => {
            if (enableHistoryInput) {
              this.handleKeyboard(event.key)
            }
          }}
          rows={1}
        />

        <SendButton
          preferences={preferences}
          sendMessage={this.sendMessage}
          value={value}
        />

        {showLimitCharacter && (
          <div className='characterLimit'>{characterLimit - value.length}</div>
        )}
      </div>
    )
  }
}

export default Input
