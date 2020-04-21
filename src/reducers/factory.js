
let initialState = {
    
    factory : 
        [
            {   count: 6,
                diamond: 5,
                duration: 300,
                factory_id: 1,
                jeweltype_id: 4,
                level: 0
            },
            {
                count: 3,
                diamond: 7,
                duration: 900,
                factory_id: 2,
                jeweltype_id: 5,
                level: 0   
            },
            {
                count: 6,
                diamond: 7,
                duration: 900,
                factory_id: 3,
                jeweltype_id: 7,
                level: 0,
            }            

        ]
}
    
    

        
const tasks = (state = initialState, action) => {
    switch (action.type) {
             
        default:            
            return state        
    }
}

export default tasks