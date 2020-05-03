//let initialState = [];
import { SET_CHAT_DATA} from '../actions/ActionTypes'

let initialState = {
    chatroom: []
}  
const chatroom = (state = initialState, action) => {
    switch (action.type) {
        case SET_CHAT_DATA:
            return{
                ...state,
                chatroom: action.chatData
            }
             
        default:            
            return state      
              
    }
}

export default chatroom