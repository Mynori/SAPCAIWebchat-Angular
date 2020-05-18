
import React from 'react'
import ReactDOM from 'react-dom'
import { store } from './store'


const idChatDiv = ''

if (!document.getElementById(idChatDiv)) {
  const element = document.createElement('div')
  element.id = idChatDiv
  document.body.appendChild(element)
}

const root = document.getElementById(idChatDiv)

const script = document.currentScript || document.getElementById('cai-webchat')

const channelId = script.getAttribute('channelId')
const token = script.getAttribute('token')

const readOnly = false
if (root && channelId && token) {
  
}
