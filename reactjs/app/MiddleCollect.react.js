var React = require('react');
var reactDOM = require('react-dom');
var Collection = require('./collection.react');

var MiddleCollect = React.createClass({
	render: function() {
		return <div>
			<Collection setMessage={this.props.setMessage} />
		</div>
	}
})

module.exports = MiddleCollect;