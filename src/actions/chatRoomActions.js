import { SET_CHAT_DATA } from './ActionTypes'

export const setChatData = (chatData) => {
    return {
        type: SET_CHAT_DATA,
        chatData: chatData
    }
}
