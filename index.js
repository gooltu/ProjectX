/**
 * @format
 */
import './src/components/JCUtils/JCScalingUtil'
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
if(!__DEV__){
    console.log = () => {}
}
AppRegistry.registerComponent(appName, () => App);
