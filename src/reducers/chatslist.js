//let initialState = [];
import {SET_ACTIVE_CHAT, SET_CHAT_LIST_DATA} from '../actions/ActionTypes'

let initialState = {
    activeChat:{},
    chatList : [] 
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
        default:            
            return state      

    }
}

export default chatslist