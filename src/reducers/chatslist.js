//let initialState = [];
import {SET_ACTIVE_CHAT, SET_CHAT_LIST_DATA, SET_PRESENCE} from '../actions/ActionTypes'

let initialState = {
    activeChat:{},
    chatList : [],
    presence: {}
}
    

        
const chatslist = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
        case SET_ACTIVE_CHAT:
            return{
                ...state,
                activeChat: action.activeChat
            }
        case SET_CHAT_LIST_DATA:
            return{
                ...state,
                chatList: action.chatList
            }
        case SET_PRESENCE: 
        return{
            ...state,
            presence: action.presenceData
        }
        default:            
            return state      

    }
}

export default chatslist