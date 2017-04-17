import React from 'react'
import {Row, Col} from 'antd'

var ConceptMapInformation = React.createClass({
	
	render: function(){
		return(
			<Row>
				<Col span={12}>
					<h3> Discuss with your friend, share what you learned and save the knowledge into your pocket! </h3>
					<h3> Use concept map to visualize your knowledge will let you communicate better. You can save the concept map and review what you learned just <b>in a glance :)</b> </h3>
					<br/>
					<br/>
					<h3> What is concept map? </h3>
					<br/>
					<div>
						<h3>Component of a Concept Map</h3>
						<p><b>Nodes</b> correspond to the concepts or important terms related to your studies of a topic. For example, the concept "water" can be defined by other concepts, such as liquid, solid, and gas.</p>
						<br/>
						<p><b>Labeled links</b> identify the type of relationship. The line between a pair of concepts denotes a relationship, and the label on the line tells how the two concepts are related. 
						For example, in a concept map of seasons, the relationship between the amount of sunlight and temperature variations is labeled as "cause" – in other words it is an action relationship between antecedent and consequent. </p>
					</div>
					<br/>
					<br/>
					<div>
						<h3>Steps in Developing a Concept Map</h3>
						<p>Step 1: List key concepts/terms related to the topic</p>
						<p>Step 2: What are the important concepts? Arrange concepts into hierarchy structure/groups</p>
						<p>Step 3: Identify links between concepts</p>
					</div>
				</Col>
				<Col span={12}>
					<div className='info-container'>
						<img src='./img/ConceptMap.jpg' style={{width: 700}}></img>
					</div>
				</Col>
			</Row>
			)
	}
})
export default ConceptMapInformation