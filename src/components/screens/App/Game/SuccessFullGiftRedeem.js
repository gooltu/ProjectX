import React from 'react';
import LottieView from 'lottie-react-native';

export default class SuccessFullGiftRedeem extends React.Component {
  componentDidMount() {
      console.log("Came to lottie")
    this.animation.play();
    // Or set a specific startFrame and endFrame with:
    this.animation.play(30, 120);
  }
  static navigationOptions = {
    title: 'test',
  };

  render() {
    return (
      <LottieView
        ref={animation => {
          this.animation = animation;
        }}
        source={require('../../../../LottieSamples/trophy.json')}
      />
    );
  }
}