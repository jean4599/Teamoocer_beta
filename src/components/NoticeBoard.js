import React from 'react'
import ComfirmLinkPhrase from './ComfirmLinkPhrase'
import firebase from 'firebase'
import {toArray} from './../utils'

const NoticeBoard = React.createClass({
	getInitialState: function(){
		return{
			courseID: this.props.courseID,
			user: this.props.user,
			comfirmLinkPhrase:[],
			members: [],
		}
	},
	componentDidMount: function(){
		this.memberFire = firebase.database().ref(this.state.courseID+'/_members');
		this.memberFire.on('value', this.updateMembers);
		this.linkphraseFire = firebase.database().ref(this.state.courseID+'/_notice/_link');
		this.linkphraseFire.on('value', this.updateComfirmLinkPhrase);
		this.noticeHistory = firebase.database().ref(this.state.courseID+'/_notice/_history');
	},
	removeLinkPhraseComfirm: function(linkID){
		console.log('remove: '+linkID)
		var fir = this.noticeHistory;
		this.linkphraseFire.child(linkID).once('value').then(function(snapshot){
			fir.push(snapshot.val())			
		})
		this.linkphraseFire.child(linkID).remove();
	},
	updateMembers: function(snapshot){
		var members = toArray(snapshot.val())
		members.splice(members.indexOf(this.state.user))

		this.setState({
			members: members
		})
	},
	updateComfirmLinkPhrase: function(snapshot){
		this.setState({ comfirmLinkPhrase: toArray(snapshot.val())})
	},
	addComfirmLinkPhrase: function(linkID, requester){
		console.log('NoticeBoard: addComfirmLinkPhrase '+linkID, requester)
		var members = this.state.members;
		if(members.length>0){
			this.linkphraseFire.child(linkID).update({
				edge: linkID,
				requester: requester
			})
			var i;
			for (i=0; i<members.length; i++){
					this.linkphraseFire.child(linkID).child(members[i].uid).update({
					comfirm: false
				})
			}
		}
		else{
			this.props.changeEdgeToSolidLine(linkID)
		}
	},
  	render: function() {
  		var _ = this.state;
  		const linkPhraseComfirms = _.comfirmLinkPhrase.map((el,index)=>
  			<ComfirmLinkPhrase 
        			key={el.edge} 
        			linkID={el.edge} 
        			members={_.members} 
        			courseID={_.courseID}
        			user={_.user}
        			removeLinkPhraseComfirm={this.removeLinkPhraseComfirm}
        			changeEdgeToSolidLine={this.props.changeEdgeToSolidLine} />
  		);
    return (
      <div>
        	{linkPhraseComfirms}
      </div>
    )
  }
})

export default NoticeBoard