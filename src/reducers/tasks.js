
let initialState = {
    
    tasks : 
        [
            {id: 9, task_id: 1, coins: 56, points: 123, done: 0},
            {id: 10, task_id: 2, coins: 16, points: 105, done: 0},
            {id: 11, task_id: 3, coins: 95, points: 40, done: 0}            

        ]
}
    
    

        
const tasks = (state = initialState, action) => {
    switch (action.type) {
             
        default:            
            return state        
    }
}

export default tasks