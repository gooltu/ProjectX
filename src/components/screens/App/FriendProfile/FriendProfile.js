import React, { Component } from 'react';
import {
    Animated,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
    SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import BackButton from '../../../svg_components/BackButton';
import colors from "../../../shared_styles/colors";
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
import styles from './FriendProfile.styles'
import { Container, Header, Content, Button, ListItem, Icon, Left, Body, Right, Switch } from 'native-base';

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class FriendProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            refreshing: false,
        };
    }

    _renderScrollViewContent() {
        const data = Array.from({ length: 1 });
        return (
            <SafeAreaView style={styles.scrollViewContent}>
                {this.contactView()}
                <View style={{width:'100%', height:1, backgroundColor:colors.darkcolor3}}></View>
                {this.StatusView()}
                {this.seprator()}
                {this.firstSection()}
                {this.seprator()}
                {this.SecondSection()}
                {this.seprator()}
                {this.groupsInCommon()}
                {this.seprator()}
                {this.ContactDetail()}
            </SafeAreaView>
        );
    }
    contactView = () => {
        return (
            <View style={styles.contact}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.name}>{this.props.activeChat.PHONEBOOK_CONTACT_NAME}</Text>
                    <Text style={styles.ContactNumber}>+{this.props.activeChat.CONTACT_NUMBER}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                    <TouchableOpacity style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: 'gray', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon style={{ fontSize: 20, color: 'white' }} active name="text" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    StatusView = () => {
        return (
            <View style={styles.contact}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.statusMessage}>{this.props.activeChat.STATUS_MSG}</Text>
                    <Text style={styles.ContactNumber}>last modified 11:58 PM</Text>
                </View>
            </View>
        )
    }

    seprator() {
        return (
            <View style={{ height: 20, backgroundColor: colors.darkcolor3, width: '100%' }}>
            </View>
        )
    }
    firstSection = () => {
        return (
            <View>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "#007AFF" }}>
                            <Icon active name="image" />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.rowText}>Media, Links and Docs</Text>
                    </Body>
                    <Right>
                        <Text style={styles.number}>28</Text>
                        <Icon active name="ios-arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "green" }}>
                            <Icon active name="star" />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.rowText}>Starred Messages</Text>
                    </Body>
                    <Right>
                        <Text style={styles.number}>None</Text>
                        <Icon active name="ios-arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "#FF9501" }}>
                            <Icon active name="search" />
                        </Button>
                    </Left>
                    <Body noBorder>
                        <Text style={styles.rowText}>Chat Search</Text>
                    </Body>
                    <Right noBorder>
                        <Text style={styles.number}>On</Text>
                        <Icon active name="ios-arrow-forward" />
                    </Right>
                </ListItem>
            </View>
        )
    }

    SecondSection = () => {
        return (
            <View>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "#007AFF" }}>
                            <Icon active name="ios-volume" />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.rowText}>Mute</Text>
                    </Body>
                    <Right>
                        <Text style={styles.number}>28</Text>
                        <Icon active name="ios-arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "green" }}>
                            <Icon active name="search" />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.rowText}>Custom Tone</Text>
                    </Body>
                    <Right>
                        <Text style={styles.number}>None</Text>
                        <Icon active name="ios-arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "#FF9501" }}>
                            <Icon active name="download" />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.rowText}>Save to camera roll</Text>
                    </Body>
                    <Right>
                        <Text style={styles.number}>On</Text>
                        <Icon active name="ios-arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "#007AFF" }}>
                            <Icon active name="lock" />
                        </Button>
                    </Left>
                    <Body style={{ paddingVertical: 10 }} noBorder>
                        <Text style={styles.rowText}>Encryption</Text>
                        <Text style={{ fontSize: 10, color: 'white' }}>Messages to this chat are secured with end to end encryption.</Text>
                    </Body>
                    <Right noBorder>
                        <Text style={styles.number}>On</Text>
                        <Icon active name="ios-arrow-forward" />
                    </Right>
                </ListItem>
            </View>
        )
    }

    groupsInCommon = () => {
        return (
            <View>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "#007AFF" }}>
                            <Icon active name="people" />
                        </Button>
                    </Left>
                    <Body style={{ paddingVertical: 10 }} noBorder>
                        <Text style={styles.rowText}>Groups In Common</Text>
                    </Body>
                    <Right noBorder>
                        <Text style={styles.number}>3</Text>
                        <Icon active name="ios-arrow-forward" />
                    </Right>
                </ListItem>
            </View>
        )
    }
    ContactDetail = () => {
        return (
            <View>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "#007AFF" }}>
                            <Icon active name="contact" />
                        </Button>
                    </Left>
                    <Body style={{ paddingVertical: 10 }} noBorder>
                        <Text style={styles.rowText}>Contact Details</Text>
                    </Body>
                    <Right noBorder>
                        <Icon active name="ios-arrow-forward" />
                    </Right>
                </ListItem>
            </View>
        )
    }
    render() {
        // Because of content inset the scroll value will be negative on iOS so bring
        // it back to 0.
        const scrollY = Animated.add(
            this.state.scrollY,
            Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
        );
        const headerTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -HEADER_SCROLL_DISTANCE],
            extrapolate: 'clamp',
        });

        const imageOpacity = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        const imageTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        });

        return (
            <SafeAreaView style={styles.fill}>
                <Animated.ScrollView
                    style={styles.fill}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                        { useNativeDriver: true },
                    )}
                    contentInset={{
                        top: HEADER_MAX_HEIGHT,
                    }}
                    contentOffset={{
                        y: -HEADER_MAX_HEIGHT,
                    }}
                >
                    {this._renderScrollViewContent()}
                </Animated.ScrollView>
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.header,
                        { transform: [{ translateY: headerTranslate }] },
                    ]}
                >
                    <Animated.Image
                        style={[
                            styles.backgroundImage,
                            {
                                opacity: imageOpacity,
                                transform: [{ translateY: imageTranslate }],
                            },
                        ]}
                        source={{ uri: this.props.activeChat.IMAGE_PATH }}
                    />

                </Animated.View>
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {

    return {
        mytoken: state.mytoken,
        appstate: state.appstate,
        network: state.network,
        game: state.game,
        activeChat: state.chatslist.activeChat
    }
}

function mapDispatchToProps(dispatch) {

    return {
        openRealtimeConnection: () => dispatch(realtimeConnect()),
        closeRealtimeConnection: () => dispatch(realtimeDisconnect())
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(FriendProfile)