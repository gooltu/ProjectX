
let initialState = {

    score :{
        level: 2,
        points: 5,
        max_level_points:55
    },
    jewels:[
        {
            jeweltype_id:0,
            count: 1,
            total_count:1
        },
        {
            jeweltype_id:1,
            count: 50,
            total_count:50
        },{
            jeweltype_id:2,
            count: 0,
            total_count:0
        },{
            jeweltype_id:3,
            count: 5,
            total_count:5
        },{
            jeweltype_id:4,
            count: 0,
            total_count:0
        },{
            jeweltype_id:5,
            count: 0,
            total_count:0
        },{
            jeweltype_id:6,
            count: 5,
            total_count:5
        },{
            jeweltype_id:7,
            count: 0,
            total_count:0
        },{
            jeweltype_id:8,
            count: 0,
            total_count:0
        },{
            jeweltype_id:9,
            count: 5,
            total_count:5
        },{
            jeweltype_id:10,
            count: 0,
            total_count:0
        },{
            jeweltype_id:11,
            count: 0,
            total_count:0
        },{
            jeweltype_id:12,
            count: 5,
            total_count:5
        },{
            jeweltype_id:13,
            count: 0,
            total_count:0
        },{
            jeweltype_id:14,
            count: 0,
            total_count:0
        },{
            jeweltype_id:15,
            count: 5,
            total_count:5
        },{
            jeweltype_id:16,
            count: 0,
            total_count:0
        },{
            jeweltype_id:17,
            count: 0,
            total_count:0
        }

    ]
}   

        
const game = (state = initialState, action) => {
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

export default game