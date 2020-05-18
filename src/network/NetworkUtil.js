import axios from 'axios';
import Constants from './rest';

/**
 * Create an Axios Client with defaults
 */
const client = axios.create({
    timeout: Constants.TIMEOUT_DURATION,
});

/**
 * Request Wrapper with default success/error actions
 */
const NetworkUtil = async function (options, requireAuth) {

    if (requireAuth) {
        client.defaults.baseURL = Constants.baseURL;
        client.defaults.headers.common['jcookie'] = "connect.sid=s%3A3%3A%3A%3A%3A347416.4VEzq6Dxea%2FFZWOOCB%2FOMqgLOP%2FNSx1p%2FJHT1o0CMko"
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
