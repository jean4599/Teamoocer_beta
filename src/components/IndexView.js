import React from 'react'
import {Row, Col, Input, Icon, Button} from 'antd'
import LoginForm from './LoginForm'

const IndexView = React.createClass({
	render: function(){
		var _ = this.state;
		return (
			<div>
				<Row type="flex" justify="center" className='title'>
					<Col span={8}>TEAMoocer</Col>
				</Row>
				<Row type='flex' justify='center'>
					<Col span={24} className='slogan'> Join us and start progressive peer learning! </Col>
				</Row>
				<Row type='flex' justify='center'> <LoginForm /> </Row>
			</div>
			)
	}
})
export default IndexView