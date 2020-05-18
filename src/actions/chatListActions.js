import { SET_ACTIVE_CHAT, SET_CHAT_LIST_DATA, SET_PRESENCE } from './ActionTypes'

export const setActiveChat = (activeChat) => {
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

export const setPresence = (presenceData) =>{
    return {
        type : SET_PRESENCE,
        presenceData: presenceData
    }
}