import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import LineChart from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';


// Firebase
import {config} from './config.js'
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
