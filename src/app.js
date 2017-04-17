import React from 'react'
import ReactDOM from 'react-dom'
import * as firebase from 'firebase'
import {IndexRoute, Router, Route, browserHistory} from 'react-router'
import conceptExtraction from './components/ConceptExtraction'
import conceptMapping from './components/ConceptMapping'
import IndexView from './components/IndexView'
import GoogleDoc from './components/GoogleDoc'
import Main from './components/Main'
import NotFoundView from './components/NotFoundView'
import { Layout } from 'antd';
import style from './app.css'

const { Header, Footer, Sider, Content } = Layout;


//Initialize firebase
var config = {
apiKey: "AIzaSyBo2N9-5K_ez1rqOm5oboQa2DauulGwFHI",
authDomain: "ccmap-1b218.firebaseapp.com",
databaseURL: "https://ccmap-1b218.firebaseio.com",
storageBucket: "ccmap-1b218.appspot.com",
messagingSenderId: "311008823460"
};

firebase.initializeApp(config);
//UI template
const T = React.createClass({
	render(){
		return (
		 <Layout>
		    <Header></Header>
		    <Content style={{ backgroundColor: 'white' }}>{this.props.children}</Content>
		  </Layout>
		)
	}
})
var courseURL = "https://www.youtube.com/watch?v=sS4523miLnw&index=2";

ReactDOM.render(
	<Router history={browserHistory}>
    <Route path="/" component={T}>
        <IndexRoute component={IndexView}/>
        <Route path='googledoc' component={GoogleDoc} />
        <Route courseURL={courseURL} path='/:courseID' component={Main} />
        <Route path="*" component={NotFoundView}/>
    </Route>
  </Router>,
  document.getElementById('container')
);