import { SET_GIFT_TASK_DATA } from '../actions/ActionTypes'

let initialState = {
    gifttasks: []
}


const tasks = (state = initialState, action) => {
    switch (action.type) {
        case SET_GIFT_TASK_DATA:
            return {
                ...state,
                gifttasks: action.payload
            }
        default:
            return state
    }
}

export default tasks