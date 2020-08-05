


export default class MainChatTextBar extends React.Component {


    render(){

        return (
            <View style={styles.mainBarConatiner}>
              <TouchableOpacity style={styles.firstItemMainBar}></TouchableOpacity>
              {Platform.OS === 'ios' && <TextInput
                placeholder="Type here"
                placeholderTextColor="white"
                onChangeText={(value) => this.processChatText(value)}
                style={this.state.chattextboxstyle}
                //style={{overflow:'scroll'}}                 
                editable={true}
                ref={ref => {
                  this.textInput = ref;
                }}
                multiline={true}
                autogrow={true}
                maxHeight={95}
                //value={value}                    
                onContentSizeChange={(e) => this.updateChatTextboxHeight(e.nativeEvent.contentSize.height)}
              />}
      
              {Platform.OS !== 'ios' && <JCTextInput
                placeholder="Type here Android"
                placeholderTextColor="white"
                ref={ref => {
                  this.textInput = ref;
                }}
                onContentCommitEvent={(event) => { this.submitChatToChannel(event.nativeEvent); console.log(event.nativeEvent); console.log('Content Commit'); }}
                onChangeText={(value) => this.processChatText(value)}
                style={this.state.chattextboxstyle}
                //style={{overflow:'scroll'}}                 
                editable={true}
                multiline={true}
                autogrow={true}
                maxHeight={95}
                //value={value}                    
                onContentSizeChange={(e) => this.updateChatTextboxHeight(e.nativeEvent.contentSize.height)}
              />}
      
              {this.state.chatboxempty && <TouchableOpacity style={styles.secondItem}></TouchableOpacity>}
              {this.state.chatboxempty && <TouchableOpacity style={styles.thirdItem}></TouchableOpacity>}
              {!this.state.chatboxempty && <TouchableOpacity onPress={() => {
                this.textInput.clear();          
                this.props.sendReply(this.state.chatboxtext, this.props.activeChat.JID)
              }} 
              style={styles.fourthItem}><Icon1 name='send' size={25} color='white' /></TouchableOpacity>}
            </View>)
            
    }

}