webpackHotUpdate(0,{435:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var d=(a(436),a(439)),o=n(d),i=(a(365),a(368)),s=n(i),l=(a(389),a(392)),r=n(l),c=(a(406),a(157)),u=n(c),p=a(440),f=n(p),h=a(441),g=(n(h),a(456)),v=(n(g),a(123)),E=n(v),m=a(158),w=(n(m),a(296)),y=n(w),C=a(403),N={physics:{enabled:!1},nodes:{chosen:!1,shape:"box",color:"#C0FCD0"},interaction:{hover:!0,selectConnectedEdges:!1},layout:{randomSeed:100},locale:"en",locales:{en:{edit:"Edit",del:"Delete selected",back:"Back",addNode:"Add Node",addEdge:"Add Edge",editNode:"Edit Node",editEdge:"Edit Edge",addDescription:"Click in an empty space to place a new node.",edgeDescription:"Click on a node and drag the edge to another node to connect them.",editEdgeDescription:"Click on the control points and drag them to a node to connect to it.",createEdgeError:"Cannot link edges to a cluster.",deleteClusterError:"Clusters cannot be deleted.",editClusterError:"Clusters cannot be edited."}}},b=[],k=[],D={},S=null,I=E.default.createClass({displayName:"ConceptMapping",getInitialState:function(){return{courseID:this.props.courseID,courseURL:this.props.courseURL,user:this.props.user,data:{},concepts:[],mode:"nomal",edgeLabelValue:"",requests:[],nodeInitialized:!1,newConcept:""}},componentDidMount:function(){var e=this;this.nodefire=y.default.database().ref(this.state.courseID+"/_network/_concepts"),this.nodefire.on("value",this.updateConcept),this.edgefire=y.default.database().ref(this.state.courseID+"/_network/_edges"),this.edgefire.on("value",this.updateEdge),N.manipulation={addNode:function(t,a){e.setState({displayAddNodePopup:"block",newNodeData:t})},deleteNode:function(t,a){var n=t.nodes[0];n&&e.nodefire.child(n).remove()},deleteEdge:function(t,a){var n=t.edges[0];n&&e.edgefire.child(n).remove()},addEdge:function(t,a){if(t.from==t.to){var n=confirm("Do you want to connect the node to itself?");1==n&&(e.setState({newEdgeData:t}),e.saveNewEdge())}else e.setState({newEdgeData:t}),e.saveNewEdge()}}},updateConcept:function(e){var t=["id","word","color","x","y"],a=["id","label","color","x","y"],n=(0,C.toArray)(e.val());this.setState({concepts:n}),b=(0,C.retrieveData)(e.val(),t,a),b=new f.default.DataSet(b),this.updateMap()},updateEdge:function(e){var t=["from","to","id","label","dashes"],a=["from","to","id","label","dashes"];k=(0,C.retrieveData)(e.val(),t,a),k-new f.default.DataSet(k),this.updateMap()},updateMap:function(){var e=this,t=null,a=null;b!=[]&&null!=S&&(t=S.getViewPosition(),a=S.getScale()),D={nodes:b,edges:k},S=new f.default.Network(this.container,D,N),t&&a&&(S.moveTo({position:t,scale:a,animation:!1}),this.props.changeMapView(t.x,t.y)),S.on("doubleClick",function(t){var a=t.edges[0];a&&e.setState({selectedEdge:a,displayEditEdgePopup:"block"})}),S.on("dragEnd",function(t){var a=t.nodes[0];if(a){var n={x:t.pointer.canvas.x,y:t.pointer.canvas.y};e.updateNode(a,n)}else{console.log("Drag the map");var d=S.getViewPosition();e.props.changeMapView(d.x,d.y)}}),S.on("dragStart",function(e){e.nodes[0]}),this.setState({data:D,network:S}),S.enableEditMode()},fitScreen:function(){var e=b.getIds();S.fit({nodes:e,animation:!1})},setNodeInitialPosition:function(e){var t=this;if(e!=[]){this.setState({nodeInitialized:!0});var a=this.state;e.map(function(e,n){y.default.database().ref(t.state.courseID+"/_network/_concepts/"+e+"/x").once("value",function(t){if(!t.val()){var n=Math.floor(501*Math.random())-250,d=Math.floor(501*Math.random())-250;y.default.database().ref(a.courseID+"/_network/_concepts/"+e).update({x:n,y:d})}})})}},handleEdgeLabelValueChange:function(e){this.setState({edgeLabelValue:e.target.value})},handleConceptInputChange:function(e){this.setState({newConcept:e.target.value})},saveNewNode:function(e,t,a){if(void 0==e&&void 0==t&&void 0==a)var e=this.state.newConcept,t=this.state.newNodeData.x,a=this.state.newNodeData.y;if(e){var n=(0,C.searchFromArrayObject)("id",e,this.state.concepts);if(""==n){var d=this.nodefire.push({word:e,x:t,y:a}).key;this.nodefire.child(d).update({id:d}),this.nodefire.child(d+"/who/"+this.state.user).update({count:1})}else this.nodefire.child(n+"/who/"+this.state.user).update({count:1})}this.clearPopUp("addNode")},saveNewEdge:function(){var e=this.edgefire.push({from:this.state.newEdgeData.from,to:this.state.newEdgeData.to,dashes:!0}).key;y.default.database().ref(this.state.courseID+"/_network/_edges/"+e).update({id:e})},saveNewEdgeLabel:function(){y.default.database().ref(this.state.courseID+"/_network/_edges/"+this.state.selectedEdge).update({label:this.state.edgeLabelValue}),this.clearPopUp("editEdge"),this.props.sendLinkPhraseNotice(this.state.selectedEdge)},deleteNode:function(e){e&&_this.nodefire.child(e).remove()},updateNode:function(e,t){var a=(0,C.searchFromArrayObject)("id",e,this.state.concepts);console.log("updateNode"),console.log(e),console.log(a),this.nodefire.child(a).update(t)},clearPopUp:function(e){"addNode"==e?this.setState({newConcept:"",displayAddNodePopup:"none"}):"editEdge"==e&&this.setState({edgeLabelValue:"",displayEditEdgePopup:"none"})},changeEdgeToSolidLine:function(e){this.edgefire.child(e).update({dashes:!1})},render:function(){var e=this,t=this.state;return E.default.createElement("div",null,E.default.createElement("div",{id:"network",ref:function(t){e.container=t}},t.requests.map(function(e,t){return E.default.createElement("div",{style:{left:e.x,top:e.y,xIndex:2,position:"relative"}},E.default.createElement(u.default,{type:"exclamation-circle",style:{color:"red",width:80}}))})),E.default.createElement(o.default,{title:"Add a new node",id:"network-popUp",style:{display:this.state.displayAddNodePopup}},"Concept: ",E.default.createElement(r.default,{id:"concept-input",value:this.state.newConcept,placeholder:"new concept",onChange:function(t){return e.handleConceptInputChange(t)}}),E.default.createElement("div",{className:"center-container"},E.default.createElement(s.default,{type:"danger",size:"small",onClick:function(){return e.clearPopUp("addNode")}}," Cancel "),E.default.createElement(s.default,{type:"primary",size:"small",onClick:function(t){return e.saveNewNode()}}," Save "))),E.default.createElement(o.default,{title:"Edit Link phrase",id:"network-popUp",style:{display:this.state.displayEditEdgePopup}},E.default.createElement(r.default,{id:"edgeLabelInput",value:this.state.edgeLabelValue,placeholder:"link phrase",onChange:function(t){return e.handleEdgeLabelValueChange(t)}}),E.default.createElement("div",{className:"center-container"},E.default.createElement(s.default,{type:"danger",size:"small",onClick:function(){return e.clearPopUp("editEdge")}}," Cancel "),E.default.createElement(s.default,{type:"primary",size:"small",onClick:function(t){return e.saveNewEdgeLabel()}}," Save "))))}});t.default=I}});