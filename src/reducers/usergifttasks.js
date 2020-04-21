
let initialState = {
    
    usergifttasks : 
        {
            1 : {
                cycle: 201949,
                done: 0,
                expiration_at: "2019-12-14T23:59:59.000Z",
                gifttask_id: 1,
                giftwon_at: null,
                id: 7,
                level: 12,
                user_id: 2
            },
            
            2 : {
                cycle: 201949,
                done: 0,
                expiration_at: "2019-12-14T23:59:59.000Z",
                gifttask_id: 2,
                giftwon_at: null,
                id: 8,
                level: 2,
                user_id: 2
            },

            3: {
                cycle: 201949,
                done: 0,
                expiration_at: "2019-12-14T23:59:59.000Z",
                gifttask_id: 3,
                giftwon_at: null,
                id: 9,
                level: 9,
                user_id: 2
            }

        }
}
    
    

        
const tasks = (state = initialState, action) => {
    switch (action.type) {
             
        default:            
            return state        
    }
}

export default tasks