import { SET_WALLET_JEWELS } from "./ActionTypes"
import NetworkManager from "../network/NetworkManager"
import rest from "../network/rest"

export const setWalletJewels = (payload) => {
    return {
        type: SET_WALLET_JEWELS,
        payload: payload
    }
}

export const getWalletJewels = () => {
    return (dispatch, getState) => {
        NetworkManager.callAPI(rest.getWalletJewelPrices, 'GET', null).then(result => {
            dispatch(setWalletJewels(result.prices))
        }).catch(error => {

        })
    }
}