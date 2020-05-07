import { SET_CHAT_DATA,ADD_CHAT_MESSAGE } from './ActionTypes'
import db from '../db/localdatabase'
export const setChatData = (chatData) => {
    return {
        type: SET_CHAT_DATA,
        chatData: chatData
    }
}

export const addChatMessage = (message) => {
    return{
        type: ADD_CHAT_MESSAGE,
        message: message
    }
}
