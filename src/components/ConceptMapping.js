import React from 'react'
import firebase from 'firebase'
import Network from './Network'
import NoticeBoard from './NoticeBoard'
import CursorPanel from './CursorPanel'
import ChatRoom from './ChatRoom'
import ConceptMapInformation from './ConceptMapInformation'
import MapGrid from './MapGrid'
import {Row, Col, Button, Modal} from 'antd'
import {getCookie} from '../utils'
import ReactCursorPosition from 'react-cursor-position'

const ConceptMapping = React.createClass({
	getInitialState: function(){
		return{
				courseID: this.props.courseID,
      			courseURL: this.props.courseURL,
      			user: getCookie('uid')			
		}
	},
	componentDidMount: function(){
		this.addMember();
	},
	addMember: function(){
		var ref = firebase.database().ref(this.state.courseID + '/_members/'+this.state.user).update({uid: this.state.user})
	},
	sendLinkPhraseNotice: function(edgeID){
		this.noticeBoard.addComfirmLinkPhrase(edgeID, this.state.user);
	},
	handleMouseMove: function(e){
		this.cursorPanel.handleMouseMove(e.x, e.y)
	},
	changeEdgeToSolidLine: function(edgeID){
		this.network.changeEdgeToSolidLine(edgeID)
	},
	showInformation: function(){
		 Modal.info({
		    title: 'How to build a concept map?',
		    content: (
		      <ConceptMapInformation />
		    ),
		    onOk() {},
		 });
	},
	fitScreen: function(){
		this.network.fitScreen();
	},
	setMapView: function(x,y){
		this.cursorPanel.setMapView(x,y)
	},
	saveNewNode: function(concept, x, y){
		this.network.saveNewNode(concept,x,y)
	},
	render: function(){
		var _ = this.state;
		return(
			<div>
				<Row style={{height:'100%'}}>
					<Col span={5}>
						<NoticeBoard ref={board=>{this.noticeBoard=board}} 
							courseID={_.courseID}
							user={_.user}
							changeEdgeToSolidLine={this.changeEdgeToSolidLine}/>
					</Col>
					<Col span={15}>
						<ReactCursorPosition id='network-container'
							// onMouseMove={(e)=>{this.handleMouseMove(e)}}
							onCursorPositionChanged={(e)=>{this.handleMouseMove(e)}}
							>
							<MapGrid />
							<CursorPanel 
								ref={panel=>{this.cursorPanel = panel}}
								courseID={_.courseID}
								user={_.user} />
							<Network 
								ref={network=>{this.network=network}}
								courseURL={_.courseURL} 
								courseID={_.courseID}
								user={_.user}
								sendLinkPhraseNotice={this.sendLinkPhraseNotice}
								changeMapView={this.setMapView} />
						</ReactCursorPosition>
					</Col>
					<Col span={4}>
						<ChatRoom
							courseID={_.courseID}
							user={_.user} />
					</Col>
				</Row>
			</div>
			)
	}
})
export default ConceptMapping