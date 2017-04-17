import React from 'react'
import {Icon, Input} from 'antd'
import firebase from 'firebase'
import Duration from './Duration'

const Concept = React.createClass({
	getInitialState:function(){
		return{
			concept: this.props.concept,
			mode: 'view',
		}
	},
	onChangeConcept: function(e){
		this.setState({ concept: e.target.value });
	},
	startEditConcept: function(){
		this.setState({mode: 'edit'})
	},
	finishEditConcept: function(){
		this.setState({mode: 'view'})
		this.props.editConcept(this.props.id, this.state.concept)
	},
	render: function(){
		return (
				<div >
					<p style={{margin:'0 10', float:'left',cursor: 'pointer', display:(this.state.mode=='view')?'inline':'none'}}
						onClick={()=>this.props.jumpToTime(this.props.played)}>
						{this.props.concept}
					</p>
					<Duration seconds={this.props.time}/>
					<Input 
						style={{display:(this.state.mode=='edit')?'inline':'none'}}
						value={this.state.concept}
						onChange={(e)=>this.onChangeConcept(e)}	
						onPressEnter={()=>this.finishEditConcept()}/>
					<p style={{cursor: 'pointer', margin:'0 10', float:'right'}}
						onClick={()=>this.props.deleteConcept(this.props.id)}>
						<Icon type="delete" style={{fontSize:'18px'}}/></p>
					<p style={{cursor: 'pointer', margin:'0 10', float:'right'}}
						onClick={()=>this.startEditConcept()}>
						<Icon type="edit" style={{fontSize:'18px'}} /></p>
				</div>
			)
	}
})
export default Concept