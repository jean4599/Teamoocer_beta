import React from 'react'
import {Card, Row, Col, Button, Input, Icon} from 'antd'
import {toArray} from './../utils'
import firebase from 'firebase'
import style from './style.css'

const ComfirmLinkPhrase = React.createClass({
	getInitialState: function(){
		return{
			nodeID: this.props.nodeID,
			user: this.props.user,
			members: this.props.members,
			courseID: this.props.courseID,
			edge: '',
			inputMessage: '',
			messages:[],
		}
	},
	componentDidMount: function(){
		this.messageFire=firebase.database().ref(this.state.courseID+'/_notice/_link/'+this.state.linkID+'/messages');
		this.messageFire.on('value', this.updateMessage);
		this.comfirmStatusFire=firebase.database().ref(this.state.courseID+'/_notice/_link/'+this.state.linkID)
		this.comfirmStatusFire.on('value', this.updateComfirmStatus);
		this.edgeFire=firebase.database().ref(this.state.courseID+'/_network/_edges/'+this.state.linkID)
		this.edgeFire.on('value', this.updateEdgeData)
	},
	componentDidUpdate: function(){
		this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
	},
	updateMessage: function(snapshot){
		this.setState({messages: toArray(snapshot.val()) });
	},
	updateEdgeData: function(snapshot){
		this.setState({edge: snapshot.val()})
	},
	updateComfirmStatus:function(snapshot){
		var me=this.state.user;
		var result=snapshot.val();
		if(result){
			this.setState({
				mycomfirmStatus: result[me].comfirm,
				allComfirmStatus: result,
			})
		}
	},
	checkAllComfirmed: function(){
		var members = this.state.members;
		var status=this.state.allComfirmStatus;
		for(var i=0; i<members.length; i++){
			console.log('check: '+members[i]+': status='+status[members[i]].comfirm)
			if(!(status[members[i]].comfirm)) return false
		}
		return true
	},
	sendMesssage: function(){
		this.messageFire.push({
			message: this.state.inputMessage,
			who: this.state.user
		})
		//clear input
		this.setState({inputMessage:''})
	},
	handleInputMessageChnage: function(e){
		this.setState({ inputMessage: e.target.value})
	},
	handleComfirm: function(e){
		var _this = this;
		this.comfirmStatusFire.child(this.state.user).update({comfirm: true}, function(error) {
		   if (error) {
		    alert("Data could not be saved." + error);
		  } else {
			    if(_this.checkAllComfirmed()){
					_this.props.removeLinkPhraseComfirm(_this.state.linkID)
					_this.props.changeEdgeToSolidLine(_this.state.linkID)
				}
		  }
		})
	},
  	render: function() {
  		var _ = this.state;
	    return (
	      <Card>
	      	<Row>
	      		<Col span={24} id='comfirm-title'>Do you think this is a proper link phrase?</Col>
	      	</Row>
	      	<Row className='comfirm-graph-container graph'>
	      		<Col span={6} className='comfirm-graph'> <p className='node right' /> </Col>
	      		<Col span={12} className='comfirm-graph'> <p className='link' /> </Col>
	      		<Col span={6} className='comfirm-graph'> <p className='node left' /> </Col>
	      	</Row>
	      	<Row className='comfirm-graph-container text'>
	      		<Col span={6} className='comfirm-graph'>{_.edge.from}</Col>
	      		<Col span={12} className='comfirm-graph'>{_.edge.label}</Col>
	      		<Col span={6} className='comfirm-graph'>{_.edge.to}</Col>
	      	</Row>
	      	<Row>
	      		<div className='message-container' ref={container=>{this.messageContainer = container}}>
	      		{_.messages.map((message, index)=>{
	      			if(message.who==_.user){
	      				return(<Col key={index} span={24}><p className='message right'> {message.message} </p></Col>)
	      			}
	      			else{
	      				return(<Col key={index} span={24}><p key={index} className='message left'> {message.message} </p></Col> )
	      			}
	      		})}
	      		</div>
	      	</Row>
	      	<Row>
	      		<Input 
	      			prefix={<Icon type="message" />} 
	      			placeholder='I want to say' 
	      			value={_.inputMessage} 
	      			onPressEnter={()=>this.sendMesssage()}
	      			onChange={(e)=>this.handleInputMessageChnage(e)} />
	      	</Row>
	      	<Row>
	      		<Col span={24}><Button className='full-length' type='primary' disabled={_.mycomfirmStatus} onClick={(e)=>{this.handleComfirm(e)}}>Yes! Let's use it!</Button></Col>
	      	</Row>
	      </Card>
	    )
  	}
})
export default ComfirmLinkPhrase