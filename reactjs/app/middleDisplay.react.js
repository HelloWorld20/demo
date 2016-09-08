var React = require('react');
var reactDOM = require('react-dom');
var Display = require('./Display.react')

var Middle = React.createClass({
	middle: function() {
		alert('middle');
	},
	render: function() {
		return <div>
			<Display onMiddle={this.middle} getFatherMessage={this.props.getFatherMessage} />
		</div>
	}
})

module.exports = Middle;