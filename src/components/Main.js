import React from 'react'
import ConceptExtraction from './ConceptExtraction'
import ConceptMapping from './ConceptMapping'
import ConceptMapInformation from './ConceptMapInformation'
import {Row, Col} from 'antd'
import Scroll from 'react-scroll'

var Link       = Scroll.Link;
var Element    = Scroll.Element;
var Events     = Scroll.Events;
var scroll     = Scroll.animateScroll;
var scrollSpy  = Scroll.scrollSpy;

const Main = React.createClass({
	getInitialState: function(){
		return {
			courseID: this.props.params.courseID,
			courseURL: this.props.route.courseURL,
			haveGoDiscussion: false,
		}
	},
	scrollToTop: function() {
    	scroll.scrollToTop();
  	},
  	goDiscussion: function(){
  		this.conceptMapping.fitScreen();
  	},
  	saveNewNode:function(concept,x,y){
  		this.conceptMapping.saveNewNode(concept,x,y)
  	},
	render: function(){
		var _ = this.state;
		return (
				<div>
					<Element name="video" className="element">
			          	<div style={{padding: '10 50', backgroundColor: '#e9e9e9', height: '80%' }}>
			          		<ConceptExtraction ref={e=>{this.conceptExtraction=e}} courseURL={this.state.courseURL} courseID={this.state.courseID}
			          			addConceptToNetwork={this.saveNewNode}/>
			          	</div>
			        </Element>

					<Link activeClass="active" to='tutorial' smooth={true} offset={50} duration={500} onClick={()=>this.goDiscussion()}>
			          <Row style={{backgroundColor: '#e9e9e9'}}>
			         	 <Col className='half-circle-up center'>Go discussion</Col>
			          </Row>
			        </Link>

			        <Element name="discussion" className="element" >
						<Link activeClass="active" onClick={this.scrollToTop} spy={true} smooth={true} offset={0} duration={500} >
				          <Row style={{backgroundColor: '#f7f7f7', height: '15%'}}>
				          	<Col className='half-circle-down center' style={{backgroundColor: '#79f7bc'}}>Review video</Col>
				          </Row>
				        </Link>

			        	<div style={{padding: '0 50', backgroundColor: '#f7f7f7', height: '90%' }}>
			        		<ConceptMapping ref={e=>{this.conceptMapping=e}} courseURL={this.state.courseURL} courseID={this.state.courseID}/>
			        	</div>
			        </Element>
			        
			        <Element name='tutorial' className='element' >
			        	<div style={{padding: '10 50', backgroundColor: 'white', height: '80%' }}><ConceptMapInformation /></div>
				        <Link activeClass="active" to="discussion" spy={true} smooth={true} offset={0} duration={500} >
					          <Row style={{backgroundColor: 'white'}} ><Col className='half-circle-up center' style={{backgroundColor: '#FFE066'}}>Start!</Col></Row>
				        </Link>
			        </Element>
					
				</div>
			)
	}
})
export default Main