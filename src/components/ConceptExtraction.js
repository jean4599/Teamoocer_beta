import React from 'react'
import {Row, Col, Button} from 'antd'
import VideoPlayer from './VideoPlayer'
import InputConcept from './InputConcept'

const ConceptExtraction = React.createClass ({
	getInitialState: function(){
		return{
			courseID: this.props.courseID,
			courseURL: this.props.courseURL,
		}
	},
	getPlayedTime: function(){
		return this.refs.player.getPlayedTime();
	},
	jumpToTime: function(time){
		this.refs.player.jumpToTime(time);
	},
	conceptAggregation: function(){
		this.inputConcept.handleConceptAggreagate();
	},
	render: function(){
		var _ = this.state;
		console.log(_.courseID) 
		return(
			<Row>
				<Col span={16}><VideoPlayer courseURL={_.courseURL} controls={true} width={854} height={480} ref='player'/></Col>
				<Col span={8}>
					<InputConcept 
						ref={c=>{this.inputConcept=c}}
						courseID={_.courseID}
						getPlayedTime={this.getPlayedTime}
						jumpToTime={this.jumpToTime}
						addConceptToNetwork={this.props.addConceptToNetwork}/>
					<Button type='primary' style={{marginTop: 10}} onClick={()=>this.conceptAggregation()}> Share these concepts </Button>
				</Col>
			</Row>
			)
	}
})
export default ConceptExtraction