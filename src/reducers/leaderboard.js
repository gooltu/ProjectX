import { SET_LEADERBOARD } from '../actions/ActionTypes'
let initialState = {
    leaderboard: {
        top1: [
            {
                name: 'Mayukh Chakraborty',
                pic: '',
                diamond: 86,
                coins: 100,
                level: 1
            },
            {
                name: 'Shashwat Singh',
                pic: '',
                diamond: 86,
                coins: 100,
                level: 2
            },
            {
                name: 'Amarjeet Dev',
                diamond: 86,
                pic: '',
                coins: 100,
                level: 3
            }
        ],
        top2: [
            {
                name: 'Arnav Patel',
                diamond: 86,
                pic: '',
                coins: 100,
                level: 108
            },
            {
                name: 'Deepak Laxkar',
                diamond: 86,
                coins: 100,
                pic: '',
                level: 109
            },
            {
                name: 'Ashish Verma',
                diamond: 86,
                coins: 100,
                pic: '',
                level: 110
            }
        ]
    }
}




const leaderboard = (state = initialState, action) => {
    switch (action.type) {
        case SET_LEADERBOARD:
            return {
                ...state,
                leaderboard: action.payload
            }
        default:
            return state
    }
}

export default leaderboard