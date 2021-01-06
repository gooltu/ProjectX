import {getConnectionObj} from './realtimeobj';
import actions from '../../actions';

export const handlePresence = (msg) => {

    return (dispatch, getState) => {

        var type = msg.getAttribute('type')
        var from = msg.getAttribute('from').split('/')[0]
        var to = msg.getAttribute('to').split('/')[0]
        console.log('PRESENCE',type, from, to)  
        
        let obj = {};
        obj[from] = 'Offline'

        if(type === 'unavailable'){
            obj[from] = 'Offline'
            dispatch(actions.setPresence(obj))
        }else {
            obj[from] = 'Online'
            dispatch(actions.setPresence(obj))
        }   

    }    
}