import {SET_PRESENCE} from '../actions/ActionTypes'

let initialState = {}
    

        
const presence = (state = initialState, action) => {
    //console.log('REDUCER');
    //console.log(action);
    switch (action.type) {           

        case SET_PRESENCE: 
        return Object.assign({}, state, action.presenceData)  

        default:            
            return state  
        
    }
}

export default presence