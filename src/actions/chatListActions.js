import {SET_ACTIVE_CHAT} from './ActionTypes'

export const setActiveDispatch = (activeChat) =>{
    return {
        type: SET_ACTIVE_CHAT,
        activeChat : activeChat
    }
}