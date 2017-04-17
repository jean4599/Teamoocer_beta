import React from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import firebase from 'firebase'
import {setCookie} from './../utils.js'

const FormItem = Form.Item;

const NormalLoginForm = Form.create()(React.createClass({
  componentDidMount: function(){
    var _this = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //user has logged in!
        setCookie('userEmail', user['email'], 1)
        setCookie('uid', user['uid'], 1)
        window.location.assign(_this.state.courseID)
      }
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.login(values['email'], values['password']);
        //courseID
        this.setState({courseID: values['courseID']})
      }
    });
  },
  login: function(email, password){
    var promise = firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
  },
  render: function() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input addonBefore={<Icon type="mail" />} placeholder="E-mail" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('courseID', {
            rules: [{ required: true, message: 'Please input your course ID!' }],
          })(
            <Input addonBefore={<Icon type="rocket" />} placeholder="Course ID" onPressEnter={this.handleSubmit}/>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a>register now!</a>
          <a className="login-form-forgot">Forgot password</a>
        </FormItem>
      </Form>
    );
  },
}));

export default NormalLoginForm
