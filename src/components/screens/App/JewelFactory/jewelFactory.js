import React from 'react'
import {
  ImageBackground,
  Button,
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

import colors from '../../../shared_styles/colors'
import JCImages from '../../../../assets/JCImages'
import { connect } from 'react-redux';
import NetworkManager from "../../../../network/NetworkManager";
import rest from '../../../../network/rest';
import styles from './jewelFactory.styles'
import actions from '../../../../actions';
import { renderJewel } from '../../../JCUtils/CommonUtils'
import FactoryOutputView from './factoryOutputView'
import FactoryRunningView from './factoryRunningView'
import FactoryFinalView from './factoryFinalView';
import CustomLoader from '../../../shared_components/CustomLoader';

class JewelFactory extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userFactory: [],
    }
  }
  componentDidMount() {
    this.props.getFactory()
    this.props.getUserFactory()
  }


  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkcolor1 }}>
        <CustomLoader loading={this.props.isLoading} />
        <ScrollView style={{ flex: 1, backgroundColor: colors.darkcolor1 }}>
          {this.props.userFactory.length > 0 ?
            this.props.factory.map((item, index) =>
              this.props.userFactory[index].is_on == 1 ?
                (new Date() - new Date(this.props.userFactory[index].start_time)) / 1000 > item.duration ?
                  <FactoryFinalView factory={item} index={index} />
                  :
                  <FactoryRunningView factory={item} userfactory={this.state.userFactory[index]} index={index} />
                :
                <FactoryOutputView factory={item} index={index} />
            )
            : null}

          <StatusBar barStyle="light-content" hidden={false} translucent={true} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}


function mapStateToProps(state) {
  return {
    factory: state.factory.factory,
    material: state.factory.materials,
    userFactory: state.userfactory.factoryuser,
    isLoading: state.userfactory.isLoading
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getFactory: () => dispatch(actions.getFactory()),
    getUserFactory: () => dispatch(actions.getUserFactory())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(JewelFactory)

