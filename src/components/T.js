import React from 'react'
import style from './T.css'
//UI template
const T = React.createClass({
	render(){
		return (
		 <Layout>
		    <Header></Header>
		    <Content style={{ padding: '50px 50px'}}>{this.props.children}</Content>
		    <Footer></Footer>
		  </Layout>
		)
	}
})