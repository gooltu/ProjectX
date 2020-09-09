import { SET_WALLET_JEWELS} from '../actions/ActionTypes'

let initialState = {
    "prices": []
}

const walletjewels = (state = initialState, action) => {
    switch (action.type) {
        case SET_WALLET_JEWELS:
            return {
                ...state,
                prices: action.payload
            }
        default:
            return state
    }
}

export default walletjewels