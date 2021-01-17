import React from 'react'
import { TouchableOpacity, View, Text, SafeAreaView, BackHandler,  } from 'react-native'
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import colors from '../../../shared_styles/colors';

export default class SuccessFullGiftRedeem extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log("Came to lottie")
    this.animation.play();
    // Or set a specific startFrame and endFrame with:
    this.animation.play(25, 50);

    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  handleBackPress = () => {    
    return true;
  }


  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkcolor3 }}>
        <TouchableOpacity style={{ margin: 20, alignItems: 'flex-end' }} onPress={() => this.props.navigation.navigate('MainTabs')}>
          <Icon name='close' color={colors.lightcolor1} size={30} />
        </TouchableOpacity>
        <View style={{ width: '100%', height: '70%', alignItems: 'center' }}>
          <LottieView
            ref={animation => {
              this.animation = animation;
            }}
             source={require('../../../../LottieSamples/trophy.json')}
           // source={{ uri: 'https://testjatinbucket.s3.ap-south-1.amazonaws.com/trophy.json' }}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 30, color: colors.lightcolor1, textAlign: 'center', fontWeight: '500' }}>Congratulations... {'\n'} You have won</Text>
        </View>

      </SafeAreaView>
    );
  }
}