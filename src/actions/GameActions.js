import { LOAD_GAME_STATE } from './ActionTypes'
import NetworkManager from '../network/NetworkManager'
import rest from '../network/rest'

export const loadGameState = () => {
    console.log('test came')
    return (dispatch, getState) => {
        console.log('test came1')
        NetworkManager.callAPI(rest.getGameState, 'GET', null).then(response=>{
            console.log(response)
            dispatch({type:LOAD_GAME_STATE, payload: response})
        }).catch(error=>{
            console.log(error)
        })
    }
}