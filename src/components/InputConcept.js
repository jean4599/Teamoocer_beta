import React from 'react'
import * as firebase from 'firebase'
import { Input, Timeline, Col, Row, Button } from 'antd'
import {getGradColor, toArray, getCookie} from '../utils'
import Duration from './Duration'
import Concept from './Concept'

const InputConcept = React.createClass({
	getInitialState: function(){
		return {
			concepts:[],
			courseID: this.props.courseID,
			conceptInputValue:'',
			videoPlayerTime: this.props.getPlayedTime,
			user: getCookie('uid')
		}
	},
	componentDidMount: function(){
		this.fire = firebase.database().ref(this.state.courseID+"/_concepts/"+this.state.user);
		this.fire.on('value', this.updateConcepts);
	},
	componentDidUpdate: function(){
		this.conceptsContainer.scrollTop = this.conceptsContainer.scrollHeight;
	},
	updateConcepts: function(snapshot){
		var conceptsArray = toArray(snapshot.val());
		this.setState({
			concepts: conceptsArray
		})
	},
	addConcept: function(){
		const time = this.state.videoPlayerTime();
		const minus_time = 3;
		var played = time.played;
		var duration = time.duration;
		if(time.duration>minus_time){
			played = time.played/time.duration * (time.duration-minus_time);
			duration = time.duration-minus_time;
		}
		var key = this.fire.push({
			word: this.state.conceptInputValue,
			played: played,
			time: duration
		}).key;
		firebase.database().ref(this.state.courseID+"/_concepts/"+this.state.user+'/'+key).update({id: key})
		this.setState({conceptInputValue:''})
	},
	deleteConcept: function(id){
		firebase.database().ref(this.state.courseID+"/_concepts/"+this.state.user+'/'+id).remove();
	},
	editConcept: function(id, content){
		firebase.database().ref(this.state.courseID+"/_concepts/"+this.state.user+'/'+id).update({word:content});
	},
	handleConceptAggreagate: function(){
		var me = this.state.user;
		this.state.concepts.map((concept,index)=>{
			var randomx = Math.floor(Math.random() * 501) - 250;
			var randomy = Math.floor(Math.random() * 501) - 250;
			this.props.addConceptToNetwork(concept['word'], randomx, randomy)
		// 	var ref = firebase.database().ref(this.state.courseID+"/_network/_concepts/"+concept['word']);
		// 	ref.once('value')
		// 	  .then(function(snapshot) {
		// 	    // handle read data.
		// 	    var c = snapshot.val();
		// 	    if(c) { //if someone has created this word
		// 	    	ref.child('_who').child(me).update({count:1}).then(function(){//add myself
		// 	    		//update the node color
		// 		    	ref.child('_who').once('value').then(function(snapshot){ //check how many people
		// 		    		var people = toArray(snapshot.val());
		// 		    		var number = people.length;
		// 		    		ref.update({color: getGradColor(number)})
		// 		    	})
		// 	    	})
		// 	    }
		// 	    else { // if this is a new word
		// 	    	var randomx = Math.floor(Math.random() * 501) - 250;
		// 			var randomy = Math.floor(Math.random() * 501) - 250;
		// 	    	ref.update({
		// 	    		id:concept['word'],
		// 	    		x: randomx,
		// 		    	y: randomy,
		// 	    	})
		// 	    	ref.child('_who').child(me).update({
		// 	    		count:1
		// 	    	})
		// 	    }
		// 	  });
		})
	},
	handleConceptInputVlueChange: function(e){
		this.setState({
			conceptInputValue: e.target.value
		})
	},
	render: function(){
		return (
			<div>
				<div ref={t=>{this.conceptsContainer = t}} 
					style={{padding:'10px', maxHeight: '80%', overflowY: 'scroll'}}>
					{this.state.concepts.map((concept,index)=>{
					return  <Timeline.Item key={index}>
								<Concept 
									id={concept.id}
									concept={concept.word}
									time={concept.time}
									played={concept.played}
									jumpToTime={this.props.jumpToTime}
									deleteConcept={this.deleteConcept}
									editConcept={this.editConcept}/>
							</Timeline.Item>
					})}
				</div>
				<Row>
					<Col span={20}><Input placeholder="New concept" onPressEnter={()=>this.addConcept()} value={this.state.conceptInputValue} onChange={this.handleConceptInputVlueChange}/></Col>
					<Col span={4}><Button type="primary" onClick={()=>this.addConcept()}>Add</Button></Col>
				</Row>
			</div>
			)
	}
})
export default InputConcept
