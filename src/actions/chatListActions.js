import { SET_ACTIVE_CHAT, SET_CHAT_LIST_DATA } from './ActionTypes'

export const setActiveDispatch = (activeChat) => {
    return {
        type: SET_ACTIVE_CHAT,
        activeChat: activeChat
    }
}

export const setChatListData = (chatListData) => {
    return {
        type : SET_CHAT_LIST_DATA,
        chatList: chatListData
    }
}