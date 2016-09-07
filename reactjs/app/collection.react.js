var React = require('react');
var ReactDOM = require('react-dom');

var Collection = React.createClass({
	getInitialState: function() {
		return {
			title: 'title of collection.react.js'
		}
	},

	render: function() {
		return <h3>{this.state.title}</h3>;
	}
})

module.exports = Collection;