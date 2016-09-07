var React = require('react');
var reactDOM = require('react-dom');

var HelloMessage = React.createClass({
	render: function(){
		return <h1>Hello {this.props.name}</h1>
	}
});


reactDOM.render(
	<HelloMessage name="bobo" />,
	document.querySelector('#example')
)

