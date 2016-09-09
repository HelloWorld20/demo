// var React = require('react');
var reactDOM = require('../plugs/react-dom');

var HelloMessage = require('./Hello.react');

reactDOM.render(
	<HelloMessage name="bobo" />,
	document.querySelector('#example')
)

