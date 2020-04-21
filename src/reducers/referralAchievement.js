
let initialState = {
    invite :{
        total_users : 0
    },
    referralAchievement:[
        {
            achievement_id : 1,
            total_count:0,
        },
        {
            achievement_id : 18-32,
            total_count:0,
        }
    ]


}   

        
const referralAchievement = (state = initialState, action) => {
    switch (action.type) {
        /*
        case 'GAMEDATA_LOAD_START':            
            return Object.assign({}, state, { isDatabaseLoading: true })

        case 'GAMEDATA_LOAD_DONE':            
            action.payload.isDatabaseLoading = false
            action.payload.isNetworkLoading = false
            return Object.assign({}, state, action.payload) 

        case 'GAMEDATA_NETWORK_LOAD_START':            
            return Object.assign({}, state, { isNetworkLoading: true }) 

        case 'GAMEDATA_LOAD_ERROR':            
            return Object.assign({}, state, { isDatabaseLoading:false, isNetworkLoading:false }) 
        */
        default:            
            return state        
    }
}

export default referralAchievement