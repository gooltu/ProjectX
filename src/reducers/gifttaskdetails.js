
let initialState = {
    
    taskdetails : 
        {
            11 : [
                {id: 1, gifttask_id: 1, jeweltype_id: 4, count: 7},
                {id: 2, gifttask_id: 1, jeweltype_id: 0, count: 1},
                {id: 3, gifttask_id: 1, jeweltype_id: 6, count: 3},
                {id: 13, gifttask_id: 1, jeweltype_id: 3, count: 3}
            ],
            
            12 : [
                {id: 4, gifttask_id: 2, jeweltype_id: 6, count: 1},
                {id: 14, gifttask_id: 2, jeweltype_id: 0, count: 1},
                {id: 22, gifttask_id: 2, jeweltype_id: 3, count: 3}
            ],

            13: [
                {id: 5, gifttask_id: 3, jeweltype_id: 4, count: 2},
                {id: 15, gifttask_id: 3, jeweltype_id: 12, count: 2},
                {id: 23, gifttask_id: 3, jeweltype_id: 15, count: 1},
                {id: 30, gifttask_id: 3, jeweltype_id: 6, count: 5},
                {id: 34, gifttask_id: 3, jeweltype_id: 3, count: 6}
            ]

        }
}
    
    

        
const tasks = (state = initialState, action) => {
    switch (action.type) {
             
        default:            
            return state        
    }
}

export default tasks