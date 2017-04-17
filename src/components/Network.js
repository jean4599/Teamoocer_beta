import vis from 'vis'
import style from 'vis/dist/vis.min.css'
import thisstyle from './style.css'
import React from 'react'
import ReactDOM from 'react-dom'
import firebase from 'firebase'
import {toArray, retrieveData, searchFromArrayObject} from '../utils'
import {Row, Col, Button, Input, Dropdown, Menu, Icon, Card} from 'antd'
	var options = {
		  	physics:{
			    enabled: false,
			},
		    nodes:{
		    	chosen:false,
		    	shape: 'box',
		    	color: '#C0FCD0'
		    },
		    interaction:{
		    	hover:true,
		    	selectConnectedEdges: false,
		    },
		    layout:{
		    	randomSeed:100,
		    },
		    locale: 'en',
		    locales:{
			  en: {
			    edit: 'Edit',
			    del: 'Delete selected',
			    back: 'Back',
			    addNode: 'Add Node',
			    addEdge: 'Add Edge',
			    editNode: 'Edit Node',
			    editEdge: 'Edit Edge',
			    addDescription: 'Click in an empty space to place a new node.',
			    edgeDescription: 'Click on a node and drag the edge to another node to connect them.',
			    editEdgeDescription: 'Click on the control points and drag them to a node to connect to it.',
			    createEdgeError: 'Cannot link edges to a cluster.',
			    deleteClusterError: 'Clusters cannot be deleted.',
			    editClusterError: 'Clusters cannot be edited.'
			  }
			},
		  };
  var nodes=[];
  var edges=[];
  var data={};
  var network=null;

const ConceptMapping = React.createClass({
	getInitialState: function(){
		return {
			courseID: this.props.courseID,
      		courseURL: this.props.courseURL,
      		user: this.props.user,
      		data:{},
      		concepts:[],
      		mode: 'nomal',
      		edgeLabelValue:'',
      		requests:[],
      		nodeInitialized:false,
      		newConcept:''
		}
	},
	componentDidMount: function(){
		var _this = this;
		//Initialize firebase access
		this.nodefire = firebase.database().ref(this.state.courseID + '/_network/_concepts')
		this.nodefire.on('value',this.updateConcept)
		this.edgefire = firebase.database().ref(this.state.courseID + '/_network/_edges')
		this.edgefire.on('value', this.updateEdge)

		options.manipulation = {
		          addNode: function(data, callback){
		            _this.setState({displayAddNodePopup:'block', newNodeData: data})
		          },
		          deleteNode: function(data, callback){
		            var node = data.nodes[0]
		            if(node){
		           		_this.nodefire.child(node).remove()    	
		            }
		          },
		          deleteEdge: function(data, callback){
		            var edge = data.edges[0]
		            if(edge){
		           		_this.edgefire.child(edge).remove()    	
	            	}
		          },
		          addEdge: function (data, callback) {
		            if (data.from == data.to) {
		              var r = confirm("Do you want to connect the node to itself?");
		              if (r == true) {
		                _this.setState({newEdgeData: data})
		                _this.saveNewEdge();
		              }
		            }
		            else {
		              _this.setState({newEdgeData: data})
		              _this.saveNewEdge();
		            }
		          }
		        }  
	},
	updateConcept: function(snapshot){
		var retreiveLabel = ['id', 'label','color', 'x', 'y']
		var containerLabel = ['id', 'label','color', 'x', 'y']
		var concepts = toArray(snapshot.val())
		this.setState({
			concepts: concepts
		})
		nodes = retrieveData(snapshot.val(), retreiveLabel, containerLabel);
		nodes = new vis.DataSet(nodes);
		this.updateMap();
	},
	updateEdge: function(snapshot){
		var retreiveLabel = ['from', 'to', 'id', 'label', 'dashes'];
		var containerLabel = ['from', 'to', 'id', 'label', 'dashes'];
		edges = retrieveData(snapshot.val(), retreiveLabel, containerLabel);
		edges - new vis.DataSet(edges);
		this.updateMap();
	},
	updateMap: function(){
		//adjust the map to previous center
		var precenter = null;
		var prescale = null;
		if(nodes!=[] && network!=null){
			precenter = network.getViewPosition();
			prescale = network.getScale();
		}
		data={
			nodes: nodes,
			edges: edges
		}
		network = new vis.Network(this.container, data, options);
		if(precenter && prescale){
			network.moveTo({
			  position: precenter,
			  scale: prescale,
			  animation: false,
			})
			this.props.changeMapView(precenter.x, precenter.y);
		}
	    network.on("doubleClick", (params)=>{
			var edgeId = params['edges'][0];
			if(edgeId){
				this.setState({selectedEdge: edgeId, displayEditEdgePopup:'block'})
			}
	    });
	    network.on("dragEnd", (params)=>{
	    	var node = params['nodes'][0];
	    	if(node){
	    		var data = {
	    			x: params['pointer']['canvas']['x'],
	    			y: params['pointer']['canvas']['y'],
	    		}
	    		this.updateNode(node,data)
	    		// firebase.database().ref(this.state.courseID+"/_network/_concepts/"+node).update({
	    		// 	x: params['pointer']['canvas']['x'],
	    		// 	y: params['pointer']['canvas']['y'],
	    		// })
	    	}
	    	else{
	    		console.log('Drag the map')
	    		var position = network.getViewPosition();
	    		this.props.changeMapView(position.x, position.y);
	    	}
	    });
	    network.on("dragStart", (params)=>{
	    	var node = params['nodes'][0]
	    });
		this.setState({
			data: data,
			network: network
		})
		network.enableEditMode()
	},
	fitScreen: function(){
		var fitnodes = nodes.getIds();
		network.fit({
			nodes: fitnodes,
			animation: false,
		})
	},
	setNodeInitialPosition:function(ids){
		if(ids!=[]){
			this.setState({nodeInitialized:true})
			var _ = this.state;
			ids.map((id, index)=>{
				firebase.database().ref(this.state.courseID+"/_network/_concepts/"+id+"/x").once('value',function(snapshot){
					if(!snapshot.val()){
						var randomx = Math.floor(Math.random() * 501) - 250;
						var randomy = Math.floor(Math.random() * 501) - 250;
						firebase.database().ref(_.courseID+"/_network/_concepts/"+id).update({
				    			x: randomx,
				    			y: randomy,
				    		})
					}
				})
			})
		}
	},
	handleEdgeLabelValueChange: function(e){
		this.setState({
			edgeLabelValue: e.target.value,
		})
	},
	handleConceptInputChange: function(e){
		this.setState({ newConcept: e.target.value})
	},
	saveNewNode:function(concept,x,y){
		//savedata into firebase
		if(concept==undefined&&x==undefined&&y==undefined){
			var concept = this.state.newConcept;
			var x = this.state.newNodeData.x;
			var y = this.state.newNodeData.y;
		}
		
		if(concept){
			console.log('Save new node ' + concept)
			var search_result = searchFromArrayObject('label', concept, this.state.concepts)
			if(search_result==''){
				var key = this.nodefire.push({
					label: concept,
					x: x,
					y: y
				}).key;
				this.nodefire.child(key).update({
					id:key
				})
				this.nodefire.child(key+'/who/'+this.state.user).update({
					count:1
				})
			}
			else{
				this.nodefire.child(search_result+'/who/'+this.state.user).update({
					count:1
				})
			}
		}

		this.clearPopUp('addNode');
	},
	saveNewEdge:function(){
		var key = this.edgefire.push({
			from: this.state.newEdgeData.from,
			to: this.state.newEdgeData.to,
			dashes: true,
		}).key
		firebase.database().ref(this.state.courseID+"/_network/_edges/"+key).update({id: key})
	},
	saveNewEdgeLabel: function(){
		firebase.database().ref(this.state.courseID+"/_network/_edges/"+this.state.selectedEdge).update({
			label: this.state.edgeLabelValue
		})
		this.clearPopUp('editEdge')
		this.props.sendLinkPhraseNotice(this.state.selectedEdge)
	},
	deleteNode: function(node){
        if(node){
       		_this.nodefire.child(node).remove()    	
        }
	},
	updateNode: function(conceptID, data){
		var nodekey = searchFromArrayObject('id', conceptID, this.state.concepts)
		console.log('updateNode')
		console.log(conceptID)
		console.log(nodekey)
		this.nodefire.child(nodekey).update(data)
	},
	clearPopUp:function(type){
		if(type == 'addNode') this.setState({newConcept:'', displayAddNodePopup:'none'})
		else if(type =='editEdge') this.setState({ edgeLabelValue:'', displayEditEdgePopup: 'none'})
	},
	changeEdgeToSolidLine: function(edgeId){
		this.edgefire.child(edgeId).update({dashes: false})
	},
	render: function(){
		var _ = this.state;

		return (
			<div>
				<div id='network' ref={container=>{this.container = container}}>
				{_.requests.map((request,index)=>{
					return (
						<div style={{left: request.x, top: request.y, xIndex: 2, position: 'relative'}}>
							<Icon type="exclamation-circle" style={{color: 'red', width: 80}}/>
						</div>
					)
				})}
				</div> 
				<Card title='Add a new node' id='network-popUp' style={{display: this.state.displayAddNodePopup}}>
				  Concept: <Input id='concept-input' value={this.state.newConcept} placeholder="new concept" onChange={(e)=>this.handleConceptInputChange(e)} />
				  <div className='center-container'>
					  <Button type="danger" size='small' onClick={()=>this.clearPopUp('addNode')}> Cancel </Button>
					  <Button type="primary" size='small' onClick={(e)=>this.saveNewNode()}> Save </Button>
				  </div>
				</Card>
				<Card title='Edit Link phrase' id='network-popUp' style={{display: this.state.displayEditEdgePopup}}>
					<Input id='edgeLabelInput' value={this.state.edgeLabelValue} placeholder="link phrase" onChange={(e)=>this.handleEdgeLabelValueChange(e)} />
					<div className='center-container'>
					<Button type="danger" size='small' onClick={()=>this.clearPopUp('editEdge')}> Cancel </Button>
					<Button type="primary" size='small' onClick={(e)=>this.saveNewEdgeLabel()}> Save </Button>
					</div>
				</Card>
			</div>
			)
	}
})
export default ConceptMapping