import axios from 'axios';
import Constants from './rest';
import { store } from '../store'
/**s
 * Create an Axios Client with defaults
 */
const client = axios.create({
    timeout: Constants.TIMEOUT_DURATION,
});

/**
 * Request Wrapper with default success/error actions
 */
const NetworkUtil = async function (options, requireAuth) {
    console.log(store.getState())
    if (requireAuth) {
        client.defaults.baseURL = Constants.baseURL;
        client.defaults.headers.common['jcookie'] = store.getState().mytoken.cookie
        client.defaults.headers.common['Accept'] = "application/json"
        client.defaults.headers.common['Content-Type'] = "application/json"
    }

    console.log(options)
    const onSuccess = function (response) {
        console.log('Response status: ', response.status);
        console.log('Response headers: ', response.headers);
        return Promise.resolve(response.data);
    }

    const onError = function (error) {
        console.log('Request Failed: ', JSON.stringify(error));
        return Promise.reject(error);
    }
    return client(options)
        .then(onSuccess)
        .catch(onError)
}

export default NetworkUtil;
