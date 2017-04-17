import React from 'react'
import firebase from 'firebase'
import {toArray} from './../utils'
import {Row, Col, Input, Icon} from 'antd'

const Message = React.createClass({
	render: function(){
		var _ = this.props;
		return <Col span={24}> <p className={(_.who==_.me)?'right':'left'}> {_.message} </p></Col>
	}
})

const ChatRoom = React.createClass({
	getInitialState: function(){
		return{
			user: this.props.user,
			courseID: this.props.courseID,
			messages: [],
			inputMessage: '',
		}
	},
	componentDidMount: function(){
		this.fire = firebase.database().ref(this.state.courseID+ '/_chat')
		this.fire.on('value', this.updateMessages);
	},
	componentDidUpdate: function(){
		this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
	},
	updateMessages: function(snapshot){
		this.setState({messages: toArray(snapshot.val()) })
	},
	sendMesssage: function(){
		this.fire.push({
			message: this.state.inputMessage,
			who: this.state.user
		})
		//clear input
		this.setState({inputMessage:''})
	},
	handleInputMessageChnage: function(e){
		this.setState({ inputMessage: e.target.value})
	},
	render: function(){
		var _ = this.state;
		const messages = this.state.messages.map((m,index)=>
			<Message key={index} who={m.who} message={m.message} me={_.user}/>
			)
		return (
			<div className='chat-area'>
			<Row>
				<div ref={container=>{this.chatContainer = container}} className='chat-container'>
				 {messages}
				</div>
			</Row>
			<Row>
				<Input 
					className='chat-input'
	      			prefix={<Icon type="message" />} 
	      			placeholder='I want to say...' 
	      			value={_.inputMessage} 
	      			size='large'
	      			onPressEnter={()=>this.sendMesssage()}
	      			onChange={(e)=>this.handleInputMessageChnage(e)} />
			</Row>
			</div>
			)
	}
})
export default ChatRoom