import React from 'react'
import firebase from 'firebase'
import {toArray} from './../utils'

const Cursor = React.createClass({
	render: function(){
		return(
			<p className='cursor' style={{backgroundColor: this.props.color, top:this.props.y, left:this.props.x}} />
			)
	}
})
const CursorPanel = React.createClass({
	getInitialState: function(){
		return{
			courseID: this.props.courseID,
			user: this.props.user,
			cursors: [],
			origin: [],
		}
	},
	componentDidMount: function(){
		this.fire = firebase.database().ref(this.state.courseID+'/_cursors/');
		this.fire.on('value', this.updateCursor);
	},
	updateCursor:function(snapshot){
		var result = snapshot.val();
		var origin = this.state.origin
		if(result){
			this.setState({origin:{x: result[this.state.user].mapX, y: result[this.state.user].mapY}})
			delete result[this.state.user]
			var cursors=[];
			Object.keys(result).map(function (key, index){
				var x = result[key].cursorX + result[key].mapX-origin.x;
				var y = result[key].cursorY + result[key].mapY-origin.y;
				cursors.push({cursorX: x, cursorY: y})
			})
			this.setState({cursors: cursors})
		}
	},
	setMapView: function(x,y){
		this.fire.child(this.state.user).update({mapX: x, mapY: y});
	},
	handleMouseMove:function(x, y){         
		var offsetX = x-30;
		var offsetY = y-30;
		this.fire.child(this.state.user).update({cursorX: offsetX, cursorY: offsetY})
	},
  	render: function() {
  		const cursors=this.state.cursors.map((cursor,index)=>
  			<Cursor key={index} x={cursor.cursorX} y={cursor.cursorY} color='red' />
  			) 
	    return (
	      <div id='cursor-panel'>
	        {cursors}
	      </div>
	    )
  }
})

export default CursorPanel