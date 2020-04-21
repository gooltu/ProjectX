
let initialState = {
    
    taskdetails : 
        {
            1 : [
                {id: 1, task_id: 1, jeweltype_id: 4, count: 7},
                {id: 2, task_id: 1, jeweltype_id: 0, count: 1},
                {id: 3, task_id: 1, jeweltype_id: 6, count: 3},
                {id: 13, task_id: 1, jeweltype_id: 3, count: 3}
            ],
            
            2 : [
                {id: 4, task_id: 2, jeweltype_id: 6, count: 1},
                {id: 14, task_id: 2, jeweltype_id: 0, count: 1},
                {id: 22, task_id: 2, jeweltype_id: 3, count: 3}
            ],

            3: [
                {id: 5, task_id: 3, jeweltype_id: 4, count: 2},
                {id: 15, task_id: 3, jeweltype_id: 12, count: 2},
                {id: 23, task_id: 3, jeweltype_id: 15, count: 1},
                {id: 30, task_id: 3, jeweltype_id: 6, count: 5},
                {id: 34, task_id: 3, jeweltype_id: 3, count: 6}
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