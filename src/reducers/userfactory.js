import { SET_USER_FACTORY } from '../actions/ActionTypes'

let initialState = {
    factoryuser: []
}


const userfactory = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
        case SET_USER_FACTORY:
            return {
                ...state,
                factoryuser: action.payload.factoryuser
            }
        default:
            return state
    }
}

export default userfactory